import { FC, useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "react-lazy-load-image-component/src/effects/blur.css";
import "../index.css";
import Footer from "../shared/Footer.tsx";
import CityClock from "../shared/CityClock.tsx";
import { TopPickEvents } from "./TopPicks.tsx";
import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { Event } from "../shared/reducers/event";
import mockEventsData from "../shared/mock-events.json";
import EventCard from "./EventCard.tsx";

const cld = new Cloudinary({ cloud: { cloudName: "dgptexs0w" } });

const getCloudinaryUrl = (publicId: string, width: number, height: number) => {
  return cld.image(publicId).resize(fill().width(width).height(height)).toURL();
};

const DateSkeleton = () => (
  <div className="w-full">
    <div className="w-full z-41 mb-2 font-dela-gothic-one bg-black">
      <div className="w-48 h-8 2xl:h-12 bg-white/10 animate-pulse" />
    </div>
  </div>
);

const EventSkeleton = () => (
  <div className="xs:w-100 md:w-150 lg:w-160 2xl:w-260 mx-auto">
    <div className="relative group mb-10 w-full">
      <div className="absolute w-full h-[400px] sm:h-[300px] translate-x-2 translate-y-2 bg-[#E4DD3B] z-0" />
      <div className="relative z-10 bg-black text-white border border-white/70 p-5 md:pb-2 2xl:pb-5 font-montserrat-medium flex flex-col sm:flex-row w-full h-[400px] sm:h-[300px]">
        {/* Image Skeleton */}
        <div className="relative sm:w-1/3 mb-4 sm:-ml-2 sm:-mt-2 sm:mb-0 2xl:mt-0 2xl:mb-0 h-48 sm:h-full">
          <div className="w-full h-full bg-white/10 animate-pulse border-2 border-[#E4DD3B]" />
        </div>

        {/* Main Info Skeleton */}
        <div className="sm:w-1/3 flex flex-col justify-start pl-12 md:pl-6 2xl:pl-12 mt-3 sm:mt-1 text-left h-full">
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
        <div className="text-[1rem] sm:text-[0.7rem] md:text-[0.7rem] 2xl:text-[1rem] sm:w-1/3 flex flex-col justify-between items-start pl-0 sm:pl-8 md:pl-4 2xl:pl-8 mt-4 sm:mt-0">
          <div className="w-full flex flex-col justify-evenly h-full space-y-8">
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

            {/* Price */}
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-[#E4DD3B]/20 animate-pulse" />
              <div className="h-5 w-24 bg-white/10 animate-pulse ml-2.5" />
            </div>

            {/* Likes */}
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-[#E4DD3B]/20 animate-pulse" />
              <div className="h-5 w-16 bg-white/10 animate-pulse ml-2.5" />
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

const Events: FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [displayedCount, setDisplayedCount] = useState<number>(10);

  const [searchParams] = useSearchParams();
  const cityParam = searchParams.get("city") || "Tartu";

  // Mock data with local likes state
  const [localEvents, setLocalEvents] = useState<Event[]>(
    mockEventsData as Event[]
  );

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Just display events for the selected city with pagination
  const events = useMemo(() => {
    const filtered = localEvents.filter((event) => event.city === cityParam);
    return filtered.slice(0, displayedCount);
  }, [localEvents, cityParam, displayedCount]);

  // Check if there are more events to load
  const hasMore = useMemo(() => {
    const totalFiltered = localEvents.filter(
      (event) => event.city === cityParam
    );
    return totalFiltered.length > displayedCount;
  }, [localEvents, cityParam, displayedCount]);

  const isFetchingNext = false;
  const isError = false;
  const error = null;

  const fetchNextPage = useCallback(() => {
    setDisplayedCount((prev) => prev + 10);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const scrollPosition = sessionStorage.getItem("scrollPosition");
    if (scrollPosition) {
      window.scrollTo(0, parseInt(scrollPosition, 10));
      sessionStorage.removeItem("scrollPosition");
    }
  }, []);

  const handleEventClick = (eventId: string) => {
    navigate(`/events/${eventId}?t=${Date.now()}`);
  };

  useEffect(() => {
    const handleResize = () => {
      // Perform any responsive logic if needed
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [currentStickyDate, setCurrentStickyDate] = useState<string>("");
  const dateRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const previousDate = useRef<string>("");

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      // Only process scroll events if we have events to display
      if (events.length === 0) {
        setCurrentStickyDate("");
        return;
      }

      const scrollY = window.scrollY;
      const scrollingDown = scrollY > lastScrollY;
      lastScrollY = scrollY;

      const refs = Object.entries(dateRefs.current)
        .filter(([, el]) => el !== null)
        .sort(
          ([, aEl], [, bEl]) =>
            aEl!.getBoundingClientRect().top - bEl!.getBoundingClientRect().top
        );

      let activeDate: string | null = null;

      if (scrollingDown) {
        for (const [date, el] of refs) {
          const top = el!.getBoundingClientRect().top;
          if (top <= 76) {
            activeDate = date;
          } else {
            break;
          }
        }
      } else {
        for (let i = refs.length - 1; i >= 0; i--) {
          const [date, el] = refs[i];
          const top = el!.getBoundingClientRect().top;
          if (top < 76) {
            activeDate = date;
            break;
          }
        }
      }

      if (!activeDate && refs.length > 0) {
        activeDate = refs[0][0];
      }

      if (activeDate && activeDate !== currentStickyDate) {
        setCurrentStickyDate(activeDate);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [events, currentStickyDate]);

  const formatDateDisplay = (dateStr: string): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <TopPickEvents />

      <CityClock city={cityParam} />

      <div className="flex-1 flex flex-col">
        <div className="flex-1 px-4 sm:px-4">
          {currentStickyDate && events.length > 0 && (
            <div className="w-full sticky top-[3.5rem] 2xl:top-[3.5rem] z-40 py-1 2xl:py-2 bg-black text-[#fff] font-dela-gothic-one uppercase font-bold text-xl 2xl:text-3xl tracking-wide text-left">
              {formatDateDisplay(currentStickyDate)}
            </div>
          )}

          {isError && (
            <p className="text-red-500 text-center font-montserrat-bolder">
              {error?.message || "An error occurred while fetching events."}
            </p>
          )}

          <div className="space-y-8 w-full justify-items-center">
            {isLoading || (events.length === 0 && !isError) ? (
                <div className="mt-8 w-full">
                  <DateSkeleton />
                  <div className="space-y-8">
                    <EventSkeleton />
                    <EventSkeleton />
                    <EventSkeleton />
                  </div>
                </div>
              ) : (
                events.map((event, index) => {
                  const transformedUrl = getCloudinaryUrl(
                    event.imageUrl,
                    320,
                    260
                  );
                  const notFirst = index !== 0;
                  const eventDate = new Date(event.openTime);
                  const eventDateStr = eventDate.toDateString();
                  const showDateMarquee = eventDateStr !== previousDate.current;

                  if (showDateMarquee) {
                    previousDate.current = eventDateStr;
                  }
                  const formattedDateTime = eventDate
                    .toISOString()
                    .split("T")[0];

                  return (
                    <div className="w-full" key={event.id}>
                      {showDateMarquee && notFirst && events.length > 0 && (
                        <div
                          ref={(el: HTMLDivElement | null) => {
                            if (el) {
                              dateRefs.current[formattedDateTime] = el;
                            }
                          }}
                          data-date={formattedDateTime}
                          className="w-full z-41 mb-2 border-white font-dela-gothic-one bg-black text-white font-dela-gothic-one uppercase font-bold text-sm 2xl:text-3xl tracking-wide text-left"
                        >
                          {formatDateDisplay(formattedDateTime)}
                        </div>
                      )}

                      {showDateMarquee && !notFirst && events.length > 0 && (
                        <div
                          ref={(el: HTMLDivElement | null) => {
                            if (el) {
                              dateRefs.current[formattedDateTime] = el;
                            }
                          }}
                          data-date={formattedDateTime}
                          className="absolute -top-full h-0 overflow-hidden"
                        >
                          {formatDateDisplay(formattedDateTime)}
                        </div>
                      )}

                      <EventCard
                        event={event}
                        imageUrl={transformedUrl}
                        onClick={handleEventClick}
                      />
                    </div>
                  );
                })
              )}
            </div>

            {hasMore && events.length > 0 && !isFetchingNext && (
              <div className="flex justify-center mt-12 mb-12">
                <button
                  onClick={() => fetchNextPage()}
                  className="px-5 py-2 bg-transparent border border-[#E4DD3B] text-[#E4DD3B] font-montserrat-medium hover:bg-[#E4DD3B]/10 transition-all duration-200 text-sm tracking-wide"
                >
                  Load More
                </button>
              </div>
            )}

            {isFetchingNext && (
              <div className="flex flex-col items-center justify-center mt-4 mb-8">
                <p className="text-white font-montserrat-bolder mb-2">
                  Loading more events...
                </p>
                <svg
                  className="animate-spin h-6 w-6 text-[#E4DD3B]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              </div>
            )}
          </div>
        </div>

        <div className="mt-20 sm:mt-32">
          <Footer />
        </div>
      </div>

  );
};

export default Events;
