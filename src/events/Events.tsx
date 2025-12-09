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
import { LoadingSpinnerIcon } from "../components/icons";

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

  const formatDateDisplay = (dateStr: string): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Group events by date
  const eventsByDate = useMemo(() => {
    const grouped: { [key: string]: Event[] } = {};
    events.forEach((event) => {
      const eventDate = new Date(event.openTime);
      const dateKey = eventDate.toISOString().split("T")[0];
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });
    return grouped;
  }, [events]);

  return (
    <div className="flex flex-col min-h-screen">
      <TopPickEvents />

      <CityClock city={cityParam} />

      <div className="flex-1 flex flex-col">
        <div className="flex-1 px-4 sm:px-4">
          {isError && (
            <p className="text-red-500 text-center font-montserrat-bolder">
              {error?.message || "An error occurred while fetching events."}
            </p>
          )}

          <div className="space-y-12 w-full justify-items-center">
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
                Object.entries(eventsByDate).map(([dateKey, dateEvents]) => (
                  <div key={dateKey} className="w-full">
                    <div className="sticky top-[3.55rem] pl-2 z-50 w-[100%] py-1 mb-0 bg-black text-[#FFF] font-tt-travels uppercase font-bold text-xl tracking-wide text-left flex items-center gap-2">
                      {formatDateDisplay(dateKey)}
                    </div>
                    <div className="space-y-0">
                      {dateEvents.map((event, index) => {
                        const transformedUrl = getCloudinaryUrl(
                          event.imageUrl,
                          320,
                          260
                        );
                        return (
                          <div key={event.id}>
                            <hr className={index === 0 ? "mt-0 mb-3" : "my-3"}/>
                            <EventCard
                              event={event}
                              imageUrl={transformedUrl}
                              onClick={handleEventClick}
                            />
                            {index === dateEvents.length - 1 && <hr className="my-3"/>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
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
                <LoadingSpinnerIcon className="h-6 w-6 text-[#E4DD3B]" />
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
