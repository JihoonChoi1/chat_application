const TypingDots = () => (
  <div className="flex items-center gap-1 rounded-full bg-surface border border-border px-3 py-2 w-fit">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="h-1.5 w-1.5 animate-bounce rounded-full bg-ember"
        style={{ animationDelay: `${i * 0.12}s` }}
      />
    ))}
  </div>
);

export default TypingDots;
