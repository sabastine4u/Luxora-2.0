export const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-1 p-2 bg-gray-100 dark:bg-ink/50 rounded-2xl w-12 h-8">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  );
};
