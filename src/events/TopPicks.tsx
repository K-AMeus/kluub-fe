import { FC, useState, useEffect } from "react";
import Marquee from "react-fast-marquee";
import { getTopPickEvents, Event } from "../shared/reducers/event";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../shared/helpers";

export const TopPicks: FC = () => {
  return (
    <Marquee
      className="bg-[#E4DD3B] border-b-2 border-t-2 border-white text-black font-dela-gothic-one mb-5 py-1"
      style={{
        textShadow:
          "1px 1px 2px white, -1px -1px 2px white, 1px -1px 2px white, -1px 1px 2px white",
      }}
    >
      <span className="text-3xl mx-4">TOP PICKS</span>
      <span className="text-3xl mx-4">TOP PICKS</span>
      <span className="text-3xl mx-4">TOP PICKS</span>
      <span className="text-3xl mx-4">TOP PICKS</span>
      <span className="text-3xl mx-4">TOP PICKS</span>
      <span className="text-3xl mx-4">TOP PICKS</span>
      <span className="text-3xl mx-4">TOP PICKS</span>
      <span className="text-3xl mx-4">TOP PICKS</span>
      <span className="text-3xl mx-4">TOP PICKS</span>
    </Marquee>
  );
};

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
        console.error("Failed to fetch top events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopEvents();
  }, []);

  const handleEventClick = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  return (
    <Marquee
      className="pt-4 pb-2 bg-black border-t-2 border-b-2 border-white text-white"
      autoFill
      pauseOnHover
      direction="right"
      loop={0}
    >
      {loading ? (
        <div className="text-xl mx-4">LOADING...</div>
      ) : topEvents.length === 0 ? (
        <div className="text-xl mx-4">😤 NO TOP PICKS AT THE MOMENT 😤</div>
      ) : (
        topEvents.map((event) => (
          <div
            key={event.id}
            className="relative group mx-6 cursor-pointer"
            onClick={() => handleEventClick(event.id)}
          >
            <div className="absolute w-full h-full translate-x-0 translate-y-0 bg-[#E4DD3B] z-0 transition-transform duration-150 group-hover:translate-x-2 group-hover:translate-y-2"></div>
            <div
              className="relative inline-flex flex-col justify-between items-start z-10 p-4 border-2 border-white bg-black text-white"
              style={{ width: "20rem", height: "7rem" }}
            >
              {/* Title row */}
              <div className="text-lg sm:text-xl font-montserrat-bolder uppercase w-full truncate">
                {event.title}
              </div>

              {/* Info row */}
              <div className="flex w-full justify-between items-center font-montserrat-medium">
                {/* Location */}
                <div className="flex items-center">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path
                      d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                      stroke="#FFFFFF"
                    />
                    <circle cx="12" cy="10" r="3" stroke="#FFFFFF" />
                  </svg>
                  <p className="sm:text-[1.1rem] text-white font-montserrat-medium ml-2 truncate max-w-[150px]">
                    {event.venue}
                  </p>
                </div>

                {/* Date */}
                <div className="flex items-center">
                  <svg
                    width="28px"
                    height="28px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 2a1 1 0 0 1 1 1v1h4V3a1 1 0 1 1 2 0v1h3a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3V3a1 1 0 0 1 1-1zM8 6H5v3h14V6h-3v1a1 1 0 1 1-2 0V6h-4v1a1 1 0 0 1-2 0V6zm11 5H5v8h14v-8z"
                      fill="#fff"
                    />
                  </svg>
                  <div className="ml-2">{formatDate(event.openTime)}</div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </Marquee>
  );
};
