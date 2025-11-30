function LoadingVideoCardList() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className="m-w-fit rounded-3xl bg-accent shadow-md p-3 animate-pulse"
        >
          {/* Thumbnail Skeleton */}
          <div className="relative w-full h-[150px] rounded-2xl overflow-hidden bg-accent"></div>

          {/* Text Section */}
          <div className="relative mt-8">
            {/* Avatar Skeleton */}
            <div className="absolute -top-12 left-2 w-10 h-10 rounded-2xl bg-accent"></div>

            {/* Title Lines */}
            <div className="h-3 bg-background rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-background rounded w-1/2 mb-2"></div>

            {/* Creator Name */}
            <div className="h-3 bg-background rounded w-1/3 mb-2"></div>

            {/* Views & Time */}
            <div className="h-3 bg-background rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default LoadingVideoCardList;
