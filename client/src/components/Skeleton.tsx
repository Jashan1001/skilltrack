interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => (
  <div
    className={`animate-pulse bg-muted rounded-md ${className}`}
  />
);

export const SkeletonCard: React.FC = () => (
  <div className="bg-card border border-border rounded-xl p-6 space-y-4">
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-3 w-1/3" />
    <Skeleton className="h-2 w-full mt-6" />
  </div>
);

export const SkeletonRow: React.FC = () => (
  <div className="flex items-center gap-4 px-4 py-3 border-t border-border">
    <Skeleton className="h-4 w-4" />
    <Skeleton className="h-4 w-48" />
    <Skeleton className="h-4 w-24 ml-auto" />
    <Skeleton className="h-4 w-16" />
  </div>
);

export const SkeletonProfile: React.FC = () => (
  <div className="space-y-10 max-w-4xl">
    <div className="flex items-center gap-6">
      <Skeleton className="w-16 h-16 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
    <div className="grid grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-24 rounded-xl" />
      ))}
    </div>
    <Skeleton className="h-40 rounded-xl" />
  </div>
);