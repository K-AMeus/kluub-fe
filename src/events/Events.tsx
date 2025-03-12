import { FC, useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User } from "firebase/auth";
import { useAuth } from "../authentication/AuthContext.tsx";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import "../index.css";
import Footer from "../shared/Footer.tsx";
import FilterBar from "./FilterBar.tsx";
import { TopPicks, TopPickEvents } from "./TopPicks.tsx";

const Events: FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [setIsWideScreen] = useState<boolean>(window.innerWidth > 1024);
  const { user } = useAuth();
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const navigate = useNavigate();
  const [likingEventIds, setLikingEventIds] = useState<Set<string>>(
    () => new Set()
  );
  const fetchingRef = useRef<boolean>(false);

  const [filterDate, setFilterDate] = useState<string>("");
  const [filterVenue, setFilterVenue] = useState<string>("");
  const [filterPrice, setFilterPrice] = useState<string>("");
  const [sortByLikes, setSortByLikes] = useState<string>("");

  const truncateDescription = (description: string, length = 80): string => {
    if (!description) return "";
    if (length <= 0) return "";
    return description.length > length
      ? description.substring(0, length) + "..."
      : description;
  };

  useEffect(() => {
    const scrollPosition = sessionStorage.getItem("scrollPosition");
    if (scrollPosition) {
      window.scrollTo(0, parseInt(scrollPosition, 10));
      sessionStorage.removeItem("scrollPosition");
    }
  }, []);

  const handleEventClick = (eventId: string) => {
    sessionStorage.setItem("scrollPosition", window.scrollY.toString());
    navigate(`/events/${eventId}`);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth > 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchEvents = async () => {
    if (fetchingRef.current || !hasMore) return;
    fetchingRef.current = true;
    try {
      const config: { headers?: Record<string, string> } = {};
      if (user) {
        const idToken = await (user as User).getIdToken();
        config.headers = { Authorization: `Bearer ${idToken}` };
      }

      const response = await axios.get(
        `https://partynbackend-production.up.railway.app/events`,
        {
          ...config,
          params: {
            cursor: nextCursor,
            size: 10,
          },
        }
      );

      if (response.data && response.data.events) {
        setEvents((prev) => [...prev, ...response.data.events]);
        setNextCursor(response.data.nextCursor);
        setHasMore(response.data.hasMore);
      } else {
        setError("Unexpected response format from server.");
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to fetch events. Please try again later.");
      setHasMore(false);
    } finally {
      fetchingRef.current = false;
    }
  };

  // Fetch initial events when first loaded (or user changes)
  useEffect(() => {
    if (!fetchingRef.current && hasMore && events.length === 0) {
      fetchEvents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleLike = async (eventId: string, liked: boolean) => {
    if (!user) {
      // redirect to login
      navigate("/auth?mode=login");
      return;
    }
    // Prevent multiple clicks on the same event
    if (likingEventIds.has(eventId)) return;
    setLikingEventIds((prev) => {
      const newSet = new Set(prev);
      newSet.add(eventId);
      return newSet;
    });

    try {
      const idToken = await user.getIdToken();
      // Optimistic UI update
      setEvents((prevEvents) =>
        prevEvents.map((ev) =>
          ev.id === eventId
            ? {
                ...ev,
                likeCount: liked ? ev.likeCount - 1 : ev.likeCount + 1,
                likedByUser: !liked,
              }
            : ev
        )
      );

      const { data } = await axios.post(
        `https://partynbackend-production.up.railway.app/events/${eventId}/like`,
        {},
        { headers: { Authorization: `Bearer ${idToken}` } }
      );

      // Replace the updated event from server
      setEvents((prevEvents) =>
        prevEvents.map((ev) => (ev.id === eventId ? data : ev))
      );
    } catch (err) {
      console.error("Error toggling like:", err);
      // Revert optimistic update
      setEvents((prevEvents) =>
        prevEvents.map((ev) =>
          ev.id === eventId
            ? {
                ...ev,
                likeCount: liked ? ev.likeCount + 1 : ev.likeCount - 1,
                likedByUser: liked,
              }
            : ev
        )
      );
      alert("Failed to update like status. Please try again.");
    } finally {
      setLikingEventIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
    }
  };

  const filteredEvents = useMemo(() => {
    const result = events.filter((ev) => {
      let valid = true;
      if (filterDate) {
        valid = valid && new Date(ev.dateTime) >= new Date(filterDate);
      }
      if (filterVenue) {
        valid = valid && ev.location === filterVenue;
      }
      if (filterPrice) {
        valid =
          valid &&
          (filterPrice === "free" ? ev.ticketPrice <= 0 : ev.ticketPrice > 0);
      }
      return valid;
    });

    if (sortByLikes === "asc") {
      result.sort((a, b) => a.likeCount - b.likeCount);
    } else if (sortByLikes === "desc") {
      result.sort((a, b) => b.likeCount - a.likeCount);
    }

    return result;
  }, [events, filterDate, filterVenue, filterPrice, sortByLikes]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header section */}
      <div className="flex-grow py-6 sm:py-12 sm:max-w-6xl w-full sm:mx-auto px-4 sm:px-8">
        <div className="text-2xl flex flex-col items-center justify-center mt-10 mb-5 text-white font-dela-gothic-one font-bold">
          <span className="mb-2 font-montserrat-bolder text-[1.625rem]">
            Tartu, Estonia
          </span>
          <h1 className="text-5xl">
            {currentTime.toLocaleTimeString("en-GB", {
              timeZone: "Europe/Tallinn",
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </h1>
          <div className="mt-4 w-1/2 border-t-2 border-white"></div>
        </div>
      </div>

      {/* FilterBar */}
      <FilterBar
        events={events}
        filterDate={filterDate}
        setFilterDate={setFilterDate}
        filterVenue={filterVenue}
        setFilterVenue={setFilterVenue}
        filterPrice={filterPrice}
        setFilterPrice={setFilterPrice}
        sortByLikes={sortByLikes}
        setSortByLikes={setSortByLikes}
      />
      <TopPicks />
      <TopPickEvents />

      {/* Main Event Listing */}
      <div className="flex-grow py-6 sm:py-12 sm:max-w-7xl w-full sm:mx-auto px-4 sm:px-8 flex flex-col items-center">
        {error && (
          <p className="text-red-500 text-center font-montserrat-bolder">
            {error}
          </p>
        )}
        <div className="space-y-8">
          {filteredEvents.length === 0 && !error ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div key={event.id} className="relative group mb-10 w-full">
                <div className="absolute w-full h-full translate-x-2 translate-y-2 bg-[#E4DD3B] z-0 transition-transform duration-200 group-hover:-translate-x-0 group-hover:-translate-y-0"></div>
                <div
                  className="relative z-10 bg-black text-white border-2 border-white p-6 font-montserrat-bolder flex flex-col sm:flex-row cursor-pointer mb-10 w-full"
                  onClick={() => handleEventClick(event.id)}
                >
                  {/* Event Image */}
                  <div className="relative sm:w-1/3 mb-4 sm:mb-0">
                    <div className="absolute inset-0 pointer-events-none"></div>
                    <LazyLoadImage
                      src={event.imageUrl}
                      alt={event.name}
                      effect="blur"
                      className="w-full h-48 sm:h-full object-cover border border-[#E4DD3B]"
                    />
                  </div>

                  {/* Event Main Info */}
                  <div className="sm:w-1/3 flex flex-col justify-start sm:pl-14 mt-4 sm:mt-6 text-left group">
                    <h2 className="text-lg sm:text-[1.50rem] font-dela-gothic-one text-white uppercase">
                      {event.name}
                    </h2>
                    <p
                      className="leading-[1.25] text-[1rem] sm:text-[1rem] text-balance text-gray-100 font-black font-montserrat mt-4"
                      style={{ wordSpacing: "0.03em" }}
                    >
                      {truncateDescription(
                        event.description,
                        window.innerWidth < 640
                          ? 0
                          : window.innerWidth < 768
                          ? 0
                          : window.innerWidth < 1024
                          ? 100
                          : window.innerWidth < 1280
                          ? 150
                          : 250
                      )}
                    </p>
                    <p className="text-sm hidden sm:block sm:text-[1.05rem] text-white font-montserrat-bolder mt-1 font-black transition-colors group-hover:text-[#E4DD3B]">
                      Read More -&gt;
                    </p>
                  </div>

                  {/* Event Side Info */}
                  <div className="sm:w-1/3 flex flex-col justify-between items-start pl-0 sm:pl-20 mt-4 sm:mt-0">
                    {/* Location */}
                    <div className="flex items-center space-x-2 mt-3 sm:mt-6 overflow-visible">
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
                      <p className="sm:text-[1.1rem] text-white font-montserrat-medium ml-2">
                        {event.location}
                      </p>
                    </div>

                    {/* Times */}
                    <div className="flex items-center">
                      <div className="flex items-center space-x-2">
                        <svg width="24" height="24" fill="none">
                          <path
                            d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12ZM3.00683 12C3.00683 16.9668 7.03321 20.9932 12 20.9932C16.9668 20.9932 20.9932 16.9668 20.9932 12C20.9932 7.03321 16.9668 3.00683 12 3.00683C7.03321 3.00683 3.00683 7.03321 3.00683 12Z"
                            fill="#FFFFFF"
                          />
                          <path
                            d="M12 5C11.4477 5 11 5.44771 11 6V12.4667C11 12.4667 11 12.7274 11.1267 12.9235C11.2115 13.0898 11.3437 13.2343 11.5174 13.3346L16.1372 16.0019C16.6155 16.278 17.2271 16.1141 17.5032 15.6358C17.7793 15.1575 17.6155 14.5459 17.1372 14.2698L13 11.8812V6C13 5.44772 12.5523 5 12 5Z"
                            fill="#FFFFFF"
                          />
                        </svg>
                        <p className="sm:text-[1.1rem] text-white font-montserrat-medium ml-2">
                          {new Date(event.dateTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}{" "}
                          -{" "}
                          {new Date(event.endDateTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Ticket Price */}
                    <div className="flex items-center space-x-2">
                      <svg
                        version="1.0"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 512 512"
                        preserveAspectRatio="xMidYMid meet"
                      >
                        <g
                          transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                          fill="#FFFFFF"
                          stroke="#FFFFFF"
                          strokeWidth={200}
                        >
                          <path d="M3920 4683 c-8 -3 -775 -289 -1705 -636 -1054 -393 -1712 -633 -1747 -639 -173 -24 -324 -129 -403 -279 -57 -109 -65 -161 -65 -447 0 -334 -5 -326 190 -335 166 -8 266 -54 356 -164 64 -79 88 -149 88 -263 0 -114 -24 -184 -88 -263 -90 -110 -190 -156 -356 -164 -195 -9 -190 -1 -190 -335 0 -286 8 -338 65 -447 59 -113 168 -207 290 -254 60 -22 64 -22 765 -27 388 -3 1353 -3 2145 0 l1440 5 60 22 c124 47 230 140 290 254 57 109 65 161 65 452 l0 259 -34 34 c-33 33 -36 34 -113 34 -167 0 -272 38 -366 131 -168 168 -168 431 0 597 93 92 201 132 359 132 151 0 154 7 154 332 0 279 -8 335 -59 436 -71 141 -197 241 -356 281 l-40 11 -188 552 c-118 349 -198 567 -215 592 -36 52 -105 102 -166 121 -48 14 -145 19 -176 8z m130 -218 c16 -8 34 -24 40 -35 15 -27 340 -991 340 -1007 0 -11 -291 -13 -1647 -13 -905 0 -1643 3 -1640 6 12 13 2833 1063 2855 1063 13 1 36 -6 52 -14z m-2340 -1341 c0 -70 2 -78 29 -105 21 -21 39 -29 65 -29 81 0 116 43 116 144 l0 66 1373 -2 1372 -3 53 -24 c65 -29 143 -113 168 -178 14 -38 18 -89 22 -240 l4 -193 -34 0 c-66 -1 -175 -30 -258 -71 -162 -79 -293 -244 -334 -419 -20 -83 -20 -217 0 -300 41 -175 172 -340 334 -419 83 -41 192 -70 258 -71 l34 0 -4 -192 c-4 -152 -8 -203 -22 -241 -25 -65 -103 -149 -168 -178 l-53 -24 -1372 -3 -1373 -2 0 66 c0 101 -35 144 -116 144 -26 0 -44 -8 -65 -29 -27 -27 -29 -35 -29 -106 l0 -76 -627 3 -628 3 -53 24 c-65 29 -143 113 -168 178 -14 38 -18 89 -22 241 l-4 192 34 0 c66 1 175 30 258 71 162 79 293 244 334 419 20 83 20 217 0 300 -41 175 -172 340 -334 419 -83 40 -192 70 -257 71 l-33 0 0 165 c0 165 10 246 37 299 21 41 92 115 127 133 78 41 91 42 724 42 l612 1 0 -76z" />
                        </g>
                      </svg>

                      <p className="sm:text-[1.1rem] text-white font-montserrat-medium font-bold">
                        {event.ticketPrice > 0
                          ? `€${event.ticketPrice}`
                          : "FREE"}
                      </p>
                    </div>

                    {/* Like Button */}
                    <div
                      className={`flex items-center cursor-pointer ${
                        likingEventIds.has(event.id)
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(event.id, event.likedByUser);
                      }}
                    >
                      <div className="relative flex items-center space-x-2">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M20.8401 4.60999C20.3294 4.099 19.7229 3.69364 19.0555 3.41708C18.388 3.14052 17.6726 2.99817 16.9501 2.99817C16.2276 2.99817 15.5122 3.14052 14.8448 3.41708C14.1773 3.69364 13.5709 4.099 13.0601 4.60999L12.0001 5.66999L10.9401 4.60999C9.90843 3.5783 8.50915 2.9987 7.05012 2.9987C5.59109 2.9987 4.19181 3.5783 3.16012 4.60999C2.12843 5.64169 1.54883 7.04096 1.54883 8.49999C1.54883 9.95903 2.12843 11.3583 3.16012 12.39L4.22012 13.45L12.0001 21.23L19.7801 13.45L20.8401 12.39C21.3511 11.8792 21.7565 11.2728 22.033 10.6053C22.3096 9.93789 22.4519 9.22248 22.4519 8.49999C22.4519 7.77751 22.3096 7.0621 22.033 6.39464C21.7565 5.72718 21.3511 5.12075 20.8401 4.60999Z"
                            fill={event.likedByUser ? "#FFFFFF" : "none"}
                            stroke="#FFFFFF"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p className="text-[1.1rem] text-white font-montserrat-medium font-bold">
                          {event.likeCount}
                        </p>
                      </div>
                    </div>

                    {/* Link to Facebook placeholder */}
                    <div className="mb-8">
                      <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sm:text-[1.1rem] flex items-center space-x-2 text-white font-montserrat-medium border border-white rounded-md p-2 px-6 hover:text-[#E4DD3B]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593
                          1.324 1.325 1.324h11.495v-9.294h-3.125v-3.622h3.125v-2.672c0-3.097
                          1.894-4.785 4.659-4.785 1.325 0 2.463.099 2.794.143v3.24h-1.918c-1.504
                          0-1.796.715-1.796 1.762v2.312h3.592l-.467 3.622h-3.125v9.294h6.125c.731
                          0 1.324-.593 1.324-1.324v-21.351c0-.732-.593-1.325-1.324-1.325z"
                          />
                        </svg>
                        <span>Event</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More / Loading / No more */}
        {hasMore && !fetchingRef.current && events.length > 0 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={fetchEvents}
              className="px-6 py-2 bg-[#E4DD3B] text-black font-montserrat-bolder font-bold hover:bg-yellow-400 transition-colors duration-200 cursor-pointer"
            >
              Load More
            </button>
          </div>
        )}

        {fetchingRef.current && (
          <div className="flex justify-center mt-4">
            <p className="text-white font-montserrat-bolder">
              Loading more events...
            </p>
          </div>
        )}

        {!hasMore && events.length > 0 && (
          <div className="flex justify-center mt-4">
            <p className="text-white font-montserrat-bolder">
              No events left to load.
            </p>
          </div>
        )}
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Events;
