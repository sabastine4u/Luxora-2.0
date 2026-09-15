// A small waving-hand emoji used next to dashboard greetings.
// The wave/pause animation and pivot point come from the `.wave-emoji`
// utility class and `animate-wave` keyframes defined in styles/index.css.
export function WaveEmoji({ className = '' }: { className?: string }) {
  return (
    <span className={`wave-emoji animate-wave ${className}`} aria-hidden="true">
      👋
    </span>
  );
}