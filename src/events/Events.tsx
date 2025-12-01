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
import { DateSkeleton, EventSkeleton } from "./EventSkeletons.tsx";

const cld = new Cloudinary({ cloud: { cloudName: "dgptexs0w" } });

const getCloudinaryUrl = (publicId: string, width: number, height: number) => {
  return cld.image(publicId).resize(fill().width(width).height(height)).toURL();
};

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

  // Set initial sticky date when events load
  useEffect(() => {
    if (events.length > 0 && !isLoading) {
      const firstEventDate = new Date(events[0].openTime);
      const formattedDateTime = firstEventDate.toISOString().split("T")[0];
      setCurrentStickyDate(formattedDateTime);
    }
  }, [events, isLoading]);

  const handleScrollInternal = useCallback(() => {
    // Only process scroll events if we have events to display
    if (events.length === 0) {
      setCurrentStickyDate("");
      return;
    }

    const refs = Object.entries(dateRefs.current)
      .filter(([, el]) => el !== null)
      .sort(
        ([, aEl], [, bEl]) =>
          aEl!.getBoundingClientRect().top - bEl!.getBoundingClientRect().top
      );

    let activeDate: string | null = null;

    // Simplified logic - just find the topmost visible date
    for (const [date, el] of refs) {
      const top = el!.getBoundingClientRect().top;
      if (top <= 76) {
        activeDate = date;
      } else {
        break;
      }
    }

    if (!activeDate && refs.length > 0) {
      activeDate = refs[0][0];
    }

    if (activeDate && activeDate !== currentStickyDate) {
      setCurrentStickyDate(activeDate);
    }
  }, [events, currentStickyDate]);


  useEffect(() => {
    window.addEventListener("scroll", handleScrollInternal, { passive: true });
    handleScrollInternal();

    return () => {
      window.removeEventListener("scroll", handleScrollInternal);
    };
  }, [handleScrollInternal]);

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
        {currentStickyDate && events.length > 0 && (
          <div className="w-full sticky top-[3.55rem] z-50 py-1 px-4 bg-black text-[#fff] font-dela-gothic-one uppercase font-bold text-sm tracking-wide text-left">
            {formatDateDisplay(currentStickyDate)}
          </div>
        )}

        <div className="flex-1 px-4 sm:px-4">
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
                          className="w-full z-50 mb-2 border-white font-dela-gothic-one bg-black text-white font-dela-gothic-one uppercase font-bold text-sm tracking-wide text-left"
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
                          className="absolute -top-full h-0 overflow-hidden z-10"
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
