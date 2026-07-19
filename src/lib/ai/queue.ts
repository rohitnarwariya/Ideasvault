import { analyzeIdea } from './analyzeIdea';

type QueueListener = (ideaId: string, status: string) => void;

class AIProcessingQueue {
  private queue: string[] = [];
  private isProcessing = false;
  private currentUserId = '';
  private listeners: Set<QueueListener> = new Set();
  private onQueueCompleteCallback: (() => void) | null = null;

  public setUserId(userId: string) {
    this.currentUserId = userId;
  }

  public registerListener(listener: QueueListener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public onQueueComplete(callback: () => void) {
    this.onQueueCompleteCallback = callback;
  }

  private notify(ideaId: string, status: string) {
    this.listeners.forEach(listener => {
      try {
        listener(ideaId, status);
      } catch (err) {
        console.error('Error in queue listener:', err);
      }
    });
  }

  /**
   * Adds an idea to the processing queue.
   */
  public enqueue(ideaId: string) {
    if (!this.queue.includes(ideaId)) {
      this.queue.push(ideaId);
      this.processNext();
    }
  }

  /**
   * Starts processing ideas that are currently pending in the system.
   */
  public async processPending(userId: string, ideas: any[]) {
    this.setUserId(userId);
    const pendingIdeas = ideas.filter(idea => !idea.ai_status || idea.ai_status === 'pending');
    for (const idea of pendingIdeas) {
      this.enqueue(idea.id);
    }
  }

  private async processNext() {
    if (this.isProcessing) return;
    if (this.queue.length === 0) {
      if (this.onQueueCompleteCallback) {
        this.onQueueCompleteCallback();
      }
      return;
    }

    this.isProcessing = true;
    const ideaId = this.queue.shift()!;

    this.notify(ideaId, 'processing');

    try {
      await analyzeIdea(this.currentUserId, ideaId);
      this.notify(ideaId, 'completed');
    } catch (error) {
      console.error(`Failed to process idea ${ideaId}:`, error);
      this.notify(ideaId, 'pending');
    } finally {
      this.isProcessing = false;
      // Yield execution to avoid blocking the thread
      setTimeout(() => {
        this.processNext();
      }, 50);
    }
  }

  public getQueueLength(): number {
    return this.queue.length;
  }
}

export const aiQueue = new AIProcessingQueue();
export default aiQueue;
export type { QueueListener };
