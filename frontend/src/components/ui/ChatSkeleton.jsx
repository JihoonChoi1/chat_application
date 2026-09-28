const ChatSkeleton = ({ rows = 8 }) => (
  <div className="flex w-full flex-col gap-2">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-3 rounded-xl px-2 py-2">
        <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-white/10" />
        <div className="flex-1">
          <div className="h-3 w-2/3 animate-pulse rounded bg-white/10" />
          <div className="mt-2 h-2.5 w-1/3 animate-pulse rounded bg-white/10" />
        </div>
      </div>
    ))}
  </div>
);

export default ChatSkeleton;
