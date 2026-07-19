import express from "express";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

// Set up JSON body parsing with a generous size limit for voice notes
app.use(express.json({ limit: "15mb" }));

// Initialize the server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
  console.log("Secure Gemini client initialized successfully on the backend.");
} else {
  console.warn("WARNING: GEMINI_API_KEY is not defined in the environment. AI requests will fail.");
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  console.log("Health check route reached");
  res.json({ status: "ok", gemini_enabled: !!aiClient });
});

// Secure server-side AI processing endpoint
app.post("/api/ai/analyze", async (req, res) => {
  console.log("AI route reached");
  try {
    if (!aiClient) {
      throw new Error("Gemini API key is not configured on the server.");
    }

    const { title, url, platform, why_saved, voice_note, voice_transcript } = req.body;

    // Build the analysis prompt with all available context
    const prompt = `Analyze the following saved inspiration idea. Provide actionable creative intelligence to help a content creator understand WHY they saved this inspiration and HOW they can reuse it practically in their own content.

Title: ${title || "Untitled"}
Platform: ${platform || "Unknown"}
URL: ${url || "No URL provided"}
User's notes (and edited transcription notes) on why they saved this: ${why_saved || "No notes provided"}
${voice_transcript ? `Original unedited voice transcript: ${voice_transcript}` : ""}
${voice_note ? "(This inspiration also includes an attached voice note recording)" : ""}

Follow these strict constraints:
1. Prefer the user's custom edited notes (User's notes) as the primary, authoritative direct source of what they want to achieve and focus on for the analysis.
2. DO NOT write generic summaries. Provide deep, specific creative insights.
3. DO NOT generate long essays or wordy fluff. Keep sections concise, punchy, and highly scannable. Use short bullet points where appropriate.
4. DO NOT hallucinate facts. Base all analysis on the provided title, notes, platform, and URL context.
5. Keep the guidance extremely practical, actionable, and creator-focused.`;

    console.log(`Sending secure Gemini request for: "${title || "Untitled"}"`);

    // Call Gemini with structured output constraints
    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an elite, crisp, and highly practical content strategist. You help digital creators dissect references and transform saved inspirations into reusable content blueprints. Your analysis is direct, punchy, highly practical, and strictly free of empty filler.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            creative_insight: {
              type: Type.STRING,
              description: "A concise, high-value creative insight highlighting the underlying hook, angle, or core strategy of this inspiration.",
            },
            why_it_works: {
              type: Type.STRING,
              description: "A crisp explanation of why this concept successfully grabs attention or is uniquely viral.",
            },
            how_to_reuse: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 to 5 highly actionable, practical steps or strategies describing exactly how a creator can adapt or reuse this idea in their own niche.",
            },
            reusable_framework: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "A step-by-step sequential blueprint or storytelling formula behind this concept (e.g., Hook -> Build-up -> Climax -> Takeaway).",
            },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 to 5 high-quality categorization tags (e.g. Hooks, Storytelling, B-Roll).",
            },
            keywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 to 5 relevant search keywords.",
            },
            content_type: {
              type: Type.STRING,
              description: "The style or format of the content (e.g., Short-form video, newsletter, carousel).",
            },
            creator: {
              type: Type.STRING,
              description: "The style or creator name if known, or a style descriptive moniker (e.g. Minimalist design, fast-paced explanation).",
            },
            difficulty: {
              type: Type.STRING,
              description: "Replicability complexity: Easy, Medium, or Hard.",
            },
          },
          required: [
            "creative_insight",
            "why_it_works",
            "how_to_reuse",
            "reusable_framework",
            "tags",
            "keywords",
            "content_type",
            "creator",
            "difficulty",
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from Gemini.");
    }

    // Robust parsing of output JSON to ensure safety from markdown blocks or extra wrapper text
    let result;
    const cleanText = text.trim();
    try {
      result = JSON.parse(cleanText);
    } catch (parseErr) {
      console.warn("Standard JSON parse failed, attempting regex extraction from Gemini response:", parseErr);
      const jsonMatch = cleanText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          result = JSON.parse(jsonMatch[1].trim());
        } catch (innerErr) {
          console.error("Regex extraction JSON parse failed:", innerErr);
        }
      }
      if (!result) {
        const startIdx = cleanText.indexOf("{");
        const endIdx = cleanText.lastIndexOf("}");
        if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
          try {
            result = JSON.parse(cleanText.substring(startIdx, endIdx + 1));
          } catch (innerErr) {
            console.error("Brace search JSON parse failed:", innerErr);
          }
        }
      }
      if (!result) {
        throw new Error("Failed to parse creative intelligence JSON response from Gemini.");
      }
    }

    res.json(result);
  } catch (error: any) {
    console.error("Secure Gemini AI processing error:", error);
    // Store the error details internally but send a sanitized generic error to the frontend
    res.status(500).json({
      error: "Internal server error occurred during AI processing.",
      message: error.message || "An unexpected error occurred."
    });
  }
});

// Secure server-side audio transcription endpoint
app.post("/api/ai/transcribe", async (req, res) => {
  console.log("Transcription route reached");
  try {
    if (!aiClient) {
      throw new Error("Gemini API key is not configured on the server.");
    }

    const { base64Audio } = req.body;
    if (!base64Audio) {
      return res.status(400).json({ error: "Missing base64Audio in request body." });
    }

    // Extract the mime type and raw base64 data
    const parts = base64Audio.split(",");
    if (parts.length < 2) {
      return res.status(400).json({ error: "Invalid data URI format." });
    }

    const header = parts[0];
    const base64Data = parts[1];

    let mimeType = "audio/webm";
    const mimeMatch = header.match(/data:([^;]+);/);
    if (mimeMatch && mimeMatch[1]) {
      mimeType = mimeMatch[1];
    }

    console.log(`Transcribing audio of mimeType: ${mimeType}`);

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
        "Please transcribe this audio recording accurately. Return ONLY the transcribed text. Do not add any introductory or concluding text, notes, or commentary."
      ],
    });

    const transcript = response.text || "";
    res.json({ transcript: transcript.trim() });
  } catch (error: any) {
    console.error("Transcription error:", error);
    res.status(500).json({
      error: "Failed to transcribe audio",
      message: error.message || "An unexpected error occurred during transcription."
    });
  }
});

// Secure server-side title generation endpoint
app.post("/api/ai/generate-title", async (req, res) => {
  console.log("Title generation route reached");
  try {
    if (!aiClient) {
      throw new Error("Gemini API key is not configured on the server.");
    }

    const { description, voiceTranscript, url, platform } = req.body;
    
    if (!description && !voiceTranscript) {
      return res.json({ title: "FALLBACK" });
    }

    const prompt = `Based on the following saved inspiration details, generate a highly concise, specific, and clear title (strictly 3 to 6 words) that summarizes the main core idea, content style, UI element, or creative hook. 

Details:
- User Description: "${description || ""}"
- Voice Transcript: "${voiceTranscript || ""}"
- Platform: "${platform || "Unknown"}"
- URL: "${url || "No URL provided"}"

Strict Constraints:
1. Summarize the main idea, style, hook, or content topic.
2. The title MUST be between 3 and 6 words long.
3. Return ONLY the generated title itself. Do not add any quotes, introductory text, explanation, or punctuation.
4. Do not focus on or include general platform names like "YouTube Clip", "TikTok Post", or "Pinterest Pin" in the title unless it is specifically part of the core creative idea.
5. If the description and voice transcript contain no meaningful content or are empty, reply with "FALLBACK".`;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    let generated = (response.text || "").trim();
    // Clean up quotes
    generated = generated.replace(/^["']|["']$/g, "");
    
    res.json({ title: generated });
  } catch (error: any) {
    console.error("Title generation error:", error);
    res.status(500).json({
      error: "Failed to generate title",
      message: error.message || "An unexpected error occurred during title generation."
    });
  }
});

export default app;
