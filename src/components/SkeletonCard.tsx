export default function SkeletonCard() {
  return (
    <div className="campus-card-static p-5 flex flex-col gap-3 animate-pulse">
      <div className="flex gap-2">
        <div className="h-4 w-14 rounded-full bg-muted skeleton-shimmer" />
        <div className="h-4 w-16 rounded-full bg-muted skeleton-shimmer" />
      </div>
      <div className="h-5 w-3/4 rounded bg-muted skeleton-shimmer" />
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-muted skeleton-shimmer" />
        <div className="h-3 w-5/6 rounded bg-muted skeleton-shimmer" />
      </div>
      <div className="flex justify-between pt-2 border-t border-border">
        <div className="h-3 w-24 rounded bg-muted skeleton-shimmer" />
        <div className="h-3 w-12 rounded bg-muted skeleton-shimmer" />
      </div>
    </div>
  );
}
