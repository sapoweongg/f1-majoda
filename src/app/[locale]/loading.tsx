export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-live="polite">
      <div className="flex gap-2" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className="live-dot h-3 w-3 rounded-full bg-accent" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  );
}
