export function getAIStatusLabel(status?: string): string {
  switch (status) {
    case 'processing':
      return 'AI Processing';
    case 'completed':
      return 'AI Ready';
    case 'failed':
      return 'AI Failed';
    case 'pending':
    default:
      return 'AI Pending';
  }
}

export function getAIStatusBadgeStyle(status?: string): { bg: string; text: string; dot: string; label: string } {
  switch (status) {
    case 'processing':
      return {
        bg: 'bg-blue-500/10 border border-blue-500/20 text-blue-400',
        text: 'text-blue-400',
        dot: 'bg-blue-400 animate-pulse',
        label: '🔵 AI Processing'
      };
    case 'completed':
      return {
        bg: 'bg-green-500/10 border border-green-500/20 text-green-400',
        text: 'text-green-400',
        dot: 'bg-green-400',
        label: '🟢 AI Ready'
      };
    case 'failed':
      return {
        bg: 'bg-red-500/10 border border-red-500/20 text-red-400',
        text: 'text-red-400',
        dot: 'bg-red-400',
        label: '🔴 AI Failed'
      };
    case 'pending':
    default:
      return {
        bg: 'bg-amber-500/10 border border-amber-500/20 text-amber-400',
        text: 'text-amber-400',
        dot: 'bg-amber-400',
        label: '🟡 AI Pending'
      };
  }
}
