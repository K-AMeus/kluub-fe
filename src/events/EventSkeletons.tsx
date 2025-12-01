export const DateSkeleton = () => (
  <div className="w-full">
    <div className="w-full z-30 mb-2 font-dela-gothic-one bg-black">
      <div className="w-48 h-8 2xl:h-12 bg-white/10 animate-pulse" />
    </div>
  </div>
);

export const EventSkeleton = () => (
  <div className="xs:w-100 md:w-150 lg:w-160 2xl:w-260 mx-auto">
    <div className="relative group mb-8 w-full">
      <div className="absolute w-full h-[360px] sm:h-[200px] translate-x-2 translate-y-2 bg-[#E4DD3B] z-0" />
      <div className="relative z-10 bg-black text-white border border-white/70 p-4 md:p-3 2xl:p-4 font-montserrat-medium flex flex-col sm:flex-row w-full h-[420px] sm:h-[200px]">
        {/* Image Skeleton */}
        <div className="relative sm:w-1/4 mb-3 sm:mb-0 sm:-ml-2 sm:-mt-2 h-40 sm:h-full">
          <div className="w-full h-full bg-white/10 animate-pulse border-2 border-[#E4DD3B]" />
        </div>

        {/* Main Info Skeleton */}
        <div className="sm:w-5/12 flex flex-col justify-start pl-0 sm:pl-6 md:pl-4 2xl:pl-8 text-left h-full">
          {/* Title */}
          <div className="h-6 2xl:h-8 w-3/4 bg-white/10 animate-pulse" />

          {/* Description */}
          <div className="mt-3 flex-grow space-y-2">
            <div className="h-3 w-full bg-white/10 animate-pulse" />
            <div className="h-3 w-5/6 bg-white/10 animate-pulse" />
            <div className="h-3 w-4/6 bg-white/10 animate-pulse" />
            <div className="h-3 w-3/4 bg-white/10 animate-pulse" />
            <div className="h-3 w-2/3 bg-white/10 animate-pulse" />
            <div className="h-3 w-full bg-white/10 animate-pulse" />
          </div>

          {/* Read More */}
          <div className="h-4 w-24 bg-[#E4DD3B]/20 animate-pulse mt-2 hidden sm:block" />
        </div>

        {/* Side Info Skeleton */}
        <div className="text-[1rem] sm:text-[0.7rem] md:text-[0.7rem] 2xl:text-[1rem] sm:w-1/3 flex flex-col items-start pl-0 sm:pl-8 md:pl-4 2xl:pl-8 mt-4 sm:mt-0">
          <div className="w-full flex flex-col space-y-2.5">
            {/* Location */}
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-[#E4DD3B]/20 animate-pulse" />
              <div className="h-5 w-32 bg-white/10 animate-pulse ml-2.5" />
            </div>

            {/* Time */}
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-[#E4DD3B]/20 animate-pulse" />
              <div className="h-5 w-40 bg-white/10 animate-pulse ml-2.5" />
            </div>

            {/* Price & Facebook */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-[#E4DD3B]/20 animate-pulse" />
                <div className="h-5 w-24 bg-white/10 animate-pulse ml-2.5" />
              </div>
              <div className="w-5 h-5 rounded-full bg-[#E4DD3B]/20 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Action buttons skeleton */}
        <div className="absolute top-4 right-3 2xl:top-6 2xl:right-6 z-20 flex flex-col items-center space-y-2">
          <div className="h-7 w-7 rounded-full bg-white/10 animate-pulse border border-white/40" />
          <div className="h-7 w-7 rounded-full bg-white/10 animate-pulse border border-white/40" />
        </div>
      </div>
    </div>
  </div>
);
