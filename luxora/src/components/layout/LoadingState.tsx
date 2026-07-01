import { Loader2 } from 'lucide-react';

export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center text-ink/50">
      <Loader2 className="mb-4 h-8 w-8 animate-spin text-gold-400" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
