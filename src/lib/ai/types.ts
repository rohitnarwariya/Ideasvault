export type AIStatus = 'pending' | 'processing' | 'completed';

export interface AIPipelineStats {
  pendingCount: number;
  processingCount: number;
  completedCount: number;
}
