import { FC } from "react";
import Footer from "../shared/Footer";

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

export const EventDetailSkeleton: FC = () => (
  <div className="relative min-h-screen flex flex-col text-white font-montserrat-medium">
    <div className="absolute inset-0 area z-0"></div>

    <div className="relative py-10 sm:max-w-6xl w-full sm:mx-auto px-8 flex-grow">
      {/* Back Button Skeleton */}
      <div className="mb-6 flex items-center">
        <div className="h-5 w-24 bg-white/10 animate-pulse rounded" />
      </div>

      {/* Image Container Skeleton */}
      <div className="relative">
        <div className="w-full h-[250px] bg-white/10 animate-pulse rounded-lg mb-4" />

        {/* Action Buttons Skeleton */}
        <div className="absolute top-6 right-6 z-20 flex flex-col items-center space-y-2">
          <div className="h-10 w-10 rounded-full bg-white/10 animate-pulse border border-white/40" />
        </div>

        {/* Date Bubble Skeleton */}
        <div className="absolute top-4 left-4 z-20">
          <div className="h-16 w-16 rounded-full bg-white/10 animate-pulse border-2 border-white/70" />
        </div>

        {/* Title Overlay Skeleton */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4 border-2 border-white/70">
          <div className="bg-black/70 px-6 py-4 border border-white/40 backdrop-blur-sm max-w-[90%]">
            <div className="h-8 w-64 bg-white/10 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column Skeleton */}
        <div className="relative self-start inline-block">
          <div className="absolute w-full h-full translate-x-1.5 translate-y-1.5 bg-[#E4DD3B] z-0"></div>
          <div className="relative z-10 p-4 bg-black border border-white/70">
            <div className="space-y-4">
              {/* Location */}
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-[#E4DD3B]/20 animate-pulse" />
                <div className="h-5 w-32 bg-white/10 animate-pulse ml-3" />
              </div>

              {/* Time */}
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-[#E4DD3B]/20 animate-pulse" />
                <div className="h-5 w-40 bg-white/10 animate-pulse ml-3" />
              </div>

              {/* Price & Facebook */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-[#E4DD3B]/20 animate-pulse" />
                  <div className="h-5 w-24 bg-white/10 animate-pulse ml-3" />
                </div>
                <div className="w-5 h-5 rounded-full bg-[#E4DD3B]/20 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Description Skeleton */}
        <div className="md:col-span-2 relative self-start flex min-h-full">
          <div className="absolute w-full h-full -translate-x-1.5 -translate-y-1.5 bg-[#E4DD3B] z-0"></div>
          <div className="relative z-10 bg-black border border-white/70 p-4 flex-grow">
            <div className="space-y-2">
              <div className="h-4 w-full bg-white/10 animate-pulse" />
              <div className="h-4 w-5/6 bg-white/10 animate-pulse" />
              <div className="h-4 w-4/6 bg-white/10 animate-pulse" />
              <div className="h-4 w-full bg-white/10 animate-pulse" />
              <div className="h-4 w-3/4 bg-white/10 animate-pulse" />
              <div className="h-4 w-5/6 bg-white/10 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="h-20"></div>

    <div className="w-full mt-auto">
      <Footer />
    </div>
  </div>
);
