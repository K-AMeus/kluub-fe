import { FC, useState, useEffect } from "react";
import Marquee from "react-fast-marquee";
import { getTopPickEvents, Event } from "../shared/reducers/event";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../shared/helpers";

export const TopPickEvents: FC = () => {
  const [topEvents, setTopEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopEvents = async () => {
      try {
        const response = await getTopPickEvents();
        const events = response?.content || [];
        setTopEvents(events);
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to fetch top events:", error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTopEvents();
  }, []);

  const handleEventClick = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  // Create loading placeholders that match the size of actual events
  const loadingPlaceholders = Array(3)
    .fill(null)
    .map((_, index) => (
      <div key={`loading-${index}`} className="mx-4 mt-2">
        <div className="relative group">
          <div className="absolute w-full h-full translate-x-0 translate-y-0 bg-[#E4DD3B] z-0"></div>
          <div className="relative inline-flex flex-col justify-between items-start z-10 p-3 border border-white/70 bg-black text-white w-56 h-16 2xl:w-84 2xl:h-24">
            {/* Title placeholder */}
            <div className="w-3/4 h-3 2xl:h-4 bg-white/20 animate-pulse rounded"></div>

            {/* Info row placeholder */}
            <div className="flex w-full justify-between items-center mt-2">
              <div className="flex items-center">
                <div className="w-3 h-3 2xl:w-4 2xl:h-4 bg-[#E4DD3B]/20 rounded-full"></div>
                <div className="w-16 h-2 2xl:h-3 bg-white/20 ml-1.5 animate-pulse rounded"></div>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 2xl:w-4 2xl:h-4 bg-[#E4DD3B]/20 rounded-full"></div>
                <div className="w-12 h-2 2xl:h-3 bg-white/20 ml-1.5 animate-pulse rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ));

  return (
    <div className="overflow-hidden">
      <Marquee
        className="py-3 bg-black border-b-2 border-white/70 text-white mt-2"
        style={{ overflowY: "hidden" }}
        autoFill
        pauseOnHover
        direction="left"
        loop={0}
      >
        {loading ? (
          loadingPlaceholders
        ) : topEvents.length === 0 ? (
          <div className="text-base mx-4 mt-2 relative group">
            <div className="absolute w-full h-full translate-x-0 translate-y-0 bg-[#E4DD3B] z-0"></div>
            <div className="relative inline-flex flex-col justify-center items-center z-10 p-3 border border-white/70 bg-black text-white w-56 h-16 2xl:w-84 2xl:h-24">
              <span>😤 NO TOP PICKS AT THE MOMENT 😤</span>
            </div>
          </div>
        ) : (
          topEvents.map((event) => (
            <div
              key={event.id}
              className="relative group mx-4 mt-2 cursor-pointer"
              onClick={() => handleEventClick(event.id)}
            >
              <div className="absolute w-full h-full translate-x-0 translate-y-0 bg-[#E4DD3B] z-0 transition-transform duration-150 group-hover:translate-x-2 group-hover:translate-y-2"></div>
              <div
                className="relative inline-flex flex-col justify-between items-start z-10 p-3 border border-white/70 bg-black text-white
                            w-56 h-16 2xl:w-84 2xl:h-24"
              >
                {/* Title row */}
                <div className="text-xs 2xl:text-lg font-montserrat-bolder uppercase w-full truncate">
                  {event.title}
                </div>

                {/* Info row */}
                <div className="flex w-full justify-between items-center font-montserrat-medium mt-2">
                  {/* Location */}
                  <div className="flex items-center">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path
                        d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                        stroke="#E4DD3B"
                      />
                      <circle cx="12" cy="10" r="3" stroke="#E4DD3B" />
                    </svg>
                    <p className="text-[0.7rem] 2xl:text-[1.0rem] text-white/90 font-montserrat-medium ml-1.5 truncate max-w-[6rem] 2xl:max-w-[12rem] ">
                      {event.venue}
                    </p>
                  </div>

                  {/* Date */}
                  <div className="flex items-center">
                    <svg
                      width="14px"
                      height="14px"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 2a1 1 0 0 1 1 1v1h4V3a1 1 0 1 1 2 0v1h3a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3V3a1 1 0 0 1 1-1zM8 6H5v3h14V6h-3v1a1 1 0 1 1-2 0V6h-4v1a1 1 0 0 1-2 0V6zm11 5H5v8h14v-8z"
                        fill="#E4DD3B"
                      />
                    </svg>
                    <div className="ml-1.5 text-[0.7rem] 2xl:text-[1.0rem] text-white/90">
                      {formatDate(event.openTime)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </Marquee>
    </div>
  );
};
