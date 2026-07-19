import { dbService } from '../../services/dbService';
import { Idea } from '../../types';

export async function analyzeIdea(userId: string, ideaId: string): Promise<Idea | null> {
  try {
    // 1. Fetch the specific idea to analyze
    const ideas = await dbService.getIdeas(userId);
    const idea = ideas.find(i => i.id === ideaId);

    if (!idea) {
      console.error(`Idea with ID ${ideaId} not found for user ${userId}.`);
      return null;
    }

    // 2. Transition state to 'processing'
    await dbService.updateIdeaAI(userId, ideaId, {
      ai_status: 'processing'
    });

    // 3. Make the secure server-side API call to analyze using Gemini
    console.log(`Triggering secure server-side Gemini analysis for idea: ${ideaId}`);
    const response = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: idea.title,
        url: idea.url,
        platform: idea.platform,
        why_saved: idea.why_saved,
        voice_note: idea.voice_note ? true : false,
        voice_transcript: idea.voice_transcript,
      }),
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.message || errBody.error || `HTTP error! status: ${response.status}`);
    }

    const geminiResult = await response.json();

    // 4. Save structured results back into the database and mark completed
    const updatedIdea = await dbService.updateIdeaAI(userId, ideaId, {
      ai_status: 'completed',
      ai_last_processed: new Date().toISOString(),
      // We store the full JSON string in ai_summary so that the detail modal can display rich breakdowns!
      ai_summary: JSON.stringify(geminiResult),
      ai_tags: geminiResult.tags || [],
      ai_platform: idea.platform,
      ai_content_type: geminiResult.content_type || 'Unknown Type',
      ai_keywords: geminiResult.keywords || [],
    });

    console.log(`Successfully processed idea ${ideaId} with Gemini.`);
    return updatedIdea;
  } catch (error) {
    // Store error internally in logs
    console.error(`Error in Gemini analysis pipeline for idea ${ideaId}:`, error);

    // Update status to failed and keep errors safe from the end user
    try {
      await dbService.updateIdeaAI(userId, ideaId, {
        ai_status: 'failed'
      });
    } catch (innerError) {
      console.error('Failed to update status to failed:', innerError);
    }
    return null;
  }
}
