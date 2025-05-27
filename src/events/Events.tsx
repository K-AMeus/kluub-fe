import { FC, useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { User } from "firebase/auth";
import { useAuth } from "../authentication/AuthContext.tsx";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import "../index.css";
import Footer from "../shared/Footer.tsx";
import FilterBar from "./FilterBar.tsx";
import { TopPickEvents } from "./TopPicks.tsx";
import { getEventsByCity, searchEvents } from "../shared/reducers/event.ts";
import { likeEvent, unlikeEvent } from "../shared/reducers/like.ts";
import { Event } from "../shared/reducers/event.ts";
import { FunnelIcon, CalendarIcon } from "@heroicons/react/24/outline";

import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";

const cld = new Cloudinary({ cloud: { cloudName: "dgptexs0w" } });

const getCloudinaryUrl = (publicId: string, width: number, height: number) => {
  return cld.image(publicId).resize(fill().width(width).height(height)).toURL();
};

const Events: FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const { user } = useAuth();
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const fetchingRef = useRef<boolean>(false);
  const [isSearchMode, setIsSearchMode] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const navigate = useNavigate();
  const [likingEventIds, setLikingEventIds] = useState<Set<string>>(
    () => new Set()
  );

  const [searchParams] = useSearchParams();
  const cityParam = searchParams.get("city") || "Tartu";

  // Filter state
  const [searchText, setSearchText] = useState<string>("");
  const [filterDate, setFilterDate] = useState<string>("");
  const [filterVenue, setFilterVenue] = useState<string>("");
  const [filterPrice, setFilterPrice] = useState<string>("");
  const [sortByLikes, setSortByLikes] = useState<string>("");
  const [venues, setVenues] = useState<string[]>([]);

  const [notFirst, setNotFirst] = useState(true);

  

  const truncateDescription = (description: string, length = 80): string => {
    if (!description) return "";
    if (length <= 0) return "";
    return description.length > length
      ? description.substring(0, length) + "..."
      : description;
  };

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
    sessionStorage.setItem("scrollPosition", window.scrollY.toString());

    navigate(`/events/${eventId}?t=${Date.now()}`);
  };

  useEffect(() => {
    const handleResize = () => {
      // Perform any responsive logic if needed
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchVenues = useCallback(async () => {
    try {
      const config: { headers?: Record<string, string> } = {};
      if (user) {
        const idToken = await (user as User).getIdToken();
        config.headers = { Authorization: `Bearer ${idToken}` };
      }

      const pageData = await getEventsByCity(cityParam, 0, 100);
      if (pageData.content && pageData.content.length > 0) {
        const uniqueVenues = Array.from(
          new Set(pageData.content.map((event) => event.venue))
        );
        setVenues(uniqueVenues);
      }
    } catch (err) {
      console.error("Error fetching venues:", err);
    }
  }, [cityParam, user]);

  useEffect(() => {
    fetchVenues();
  }, [fetchVenues]);

  const fetchEvents = async () => {
    if (fetchingRef.current || !hasMore) return;
    fetchingRef.current = true;

    try {
      const config: { headers?: Record<string, string> } = {};
      if (user) {
        const idToken = await (user as User).getIdToken();
        config.headers = { Authorization: `Bearer ${idToken}` };
      }

      const pageData = await getEventsByCity(cityParam, page, 10);
      if (pageData.content && pageData.content.length > 0) {
        setEvents((prev) => [...prev, ...pageData.content]);
        setHasMore(!pageData.last);
      } else {
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

  const fetchEventsWithFilters = async (resetPage: boolean = false) => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    const currentPage = resetPage ? 0 : page;
    if (resetPage) {
      setPage(0);
    }

    try {
      const config: { headers?: Record<string, string> } = {};
      if (user) {
        const idToken = await (user as User).getIdToken();
        config.headers = { Authorization: `Bearer ${idToken}` };
      }

      const searchParams: {
        city: string;
        venue?: string;
        startDate?: string;
        endDate?: string;
        searchText?: string;
        priceSort?: "asc" | "desc";
        likesSort?: "asc" | "desc";
        page: number;
        size: number;
      } = {
        city: cityParam,
        page: currentPage,
        size: 10,
      };

      if (filterVenue) searchParams.venue = filterVenue;
      if (filterDate)
        searchParams.startDate = new Date(filterDate).toISOString();
      if (filterPrice === "asc" || filterPrice === "desc")
        searchParams.priceSort = filterPrice;
      if (searchText) searchParams.searchText = searchText;
      if (sortByLikes) searchParams.likesSort = sortByLikes as "asc" | "desc";

      const pageData = await searchEvents(searchParams);

      if (pageData.content && pageData.content.length > 0) {
        setEvents((prev) =>
          resetPage ? pageData.content : [...prev, ...pageData.content]
        );
        setHasMore(!pageData.last);
      } else {
        if (resetPage) {
          setEvents([]);
        }
        setHasMore(false);
        setIsSearchMode(true);
      }
      setIsSearchMode(true);
    } catch (err) {
      console.error("Error searching events:", err);
      setError("Failed to search events. Please try again later.");
      setHasMore(false);
    } finally {
      fetchingRef.current = false;
    }
  };

  const clearFilters = () => {
    setSearchText("");
    setFilterDate("");
    setFilterVenue("");
    setFilterPrice("");
    setSortByLikes("");
    setIsSearchMode(false);

    setPage(0);
    setHasMore(true);

    setEvents([]);

    setRefreshTrigger((prev) => prev + 1);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      fetchEventsWithFilters(true);
    }
  };

  useEffect(() => {
    clearFilters();
  }, [cityParam]);

  useEffect(() => {
    if (!fetchingRef.current && hasMore) {
      if (isSearchMode) {
        fetchEventsWithFilters(false);
      } else {
        fetchEvents();
      }
    }
  }, [page, user, refreshTrigger]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleLike = async (eventId: string, liked: boolean) => {
    if (!user) {
      navigate("/auth?mode=login");
      return;
    }
    // Prevent multiple like clicks
    if (likingEventIds.has(eventId)) return;

    setLikingEventIds((prev) => {
      const newSet = new Set(prev);
      newSet.add(eventId);
      return newSet;
    });

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

    try {
      const idToken = await (user as User).getIdToken();
      const userId = user.uid;

      const updatedEvent = liked
        ? await unlikeEvent(eventId, userId, idToken)
        : await likeEvent(eventId, userId, idToken);

      setEvents((prevEvents) =>
        prevEvents.map((ev) => (ev.id === eventId ? updatedEvent : ev))
      );
    } catch (err) {
      console.error("Error toggling like:", err);

      // Revert optimistic update on error
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

  return (
    <div className="flex flex-col min-h-screen pt-8">
      <TopPickEvents />
      <div className="h-4"></div>

    if (sortByLikes === "asc") {
      result.sort((a, b) => a.likeCount - b.likeCount);
    } else if (sortByLikes === "desc") {
      result.sort((a, b) => b.likeCount - a.likeCount);
    }
    return result;
  }, [events, filterDate, filterVenue, filterPrice, sortByLikes]);


  const [currentStickyDate, setCurrentStickyDate] = useState<string>('');
  const dateRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const previousDate = useRef<string>('');



useEffect(() => {
  let lastScrollY = window.scrollY;

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const scrollingDown = scrollY > lastScrollY;
    lastScrollY = scrollY;

    const refs = Object.entries(dateRefs.current)
      .filter(([, el]) => el !== null)
      .sort(([, aEl], [, bEl]) =>
        aEl!.getBoundingClientRect().top - bEl!.getBoundingClientRect().top
      );

    let activeDate: string | null = null;

    if (scrollingDown) {
      for (let [date, el] of refs) {
        const top = el!.getBoundingClientRect().top;
        if (top <= 100) {
          activeDate = date;
        } else {
          break;
        }
      }
    } else {
      for (let i = refs.length - 1; i >= 0; i--) {
        const [date, el] = refs[i];
        const top = el!.getBoundingClientRect().top;
        if (top < 100) {
          activeDate = date;
          break;
        }
      }
    }

    // Fallback to first available date bar if nothing matched
    if (!activeDate && refs.length > 0) {
      activeDate = refs[0][0]; // refs[0] is [date, element]
    }

    if (activeDate && activeDate !== currentStickyDate) {
      setCurrentStickyDate(activeDate);
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initialize once on mount

  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}, [filteredEvents]);


  




  const formatDate = (date: string) => {
    const eventDate = new Date(date);
    return eventDate.toLocaleDateString(); // You can change the format based on your needs
  };

const formatDateDisplay = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',  // Sun
    month: 'short',    // May
    day: 'numeric'     // 5
  });
};

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header section */}
      <div className="flex-grow py-4 sm:py-6 sm:max-w-6xl w-full sm:mx-auto px-4 sm:px-8">
        <div className="text-xl flex flex-col items-center justify-center mt-4 mb-6 text-white font-dela-gothic-one font-bold">
          <span className="mb-2 font-montserrat-bolder text-[1.4rem]">
            {cityParam}, Estonia
          </span>
          <h1 className="text-4xl">
            {currentTime.toLocaleTimeString("en-GB", {
              timeZone: "Europe/Tallinn",
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </h1>
          <div className="mt-4 w-1/2 border-t-2 border-[#E4DD3B]"></div>
        </div>
      </div>

      <div className="w-full flex justify-center mb-2 mt-0">
        <div className="w-full max-w-7xl px-4 sm:px-8">
          <FilterBar
            events={events.map((ev) => ({
              id: ev.id,
              name: ev.title,
              dateTime: ev.openTime,
              endDateTime: ev.closeTime,
              location: ev.venue,
              ticketPrice: ev.ticket,
              description: ev.description,
              likeCount: ev.likeCount,
              likedByUser: ev.likedByUser,
              imageUrl: ev.imageUrl,
            }))}
            venues={venues}
            searchText={searchText}
            setSearchText={setSearchText}
            filterDate={filterDate}
            setFilterDate={setFilterDate}
            filterVenue={filterVenue}
            setFilterVenue={setFilterVenue}
            filterPrice={filterPrice}
            setFilterPrice={setFilterPrice}
            sortByLikes={sortByLikes}
            setSortByLikes={setSortByLikes}
            onApplyFilters={() => fetchEventsWithFilters(true)}
            onClearFilters={clearFilters}
            onSearchKeyPress={handleSearchKeyPress}
          />
        </div>
      </div>


      {/* Main Event Listing */}
      <div className="flex-grow py-6 sm:pb-12 sm:pt-0 sm:max-w-7xl w-full sm:mx-auto px-4 sm:px-8 flex flex-col items-center"  > 

        {currentStickyDate && (
          <div className="w-full mt-10 sticky top-[80px] z-40 py-3 bg-black text-[#fff] font-dela-gothic-one uppercase font-bold text-4xl tracking-wide [text-shadow:_-1px_-1px_0_black,_1px_-1px_0_black,_-1px_1px_0_black,_1px_1px_0_black] text-left">
            {formatDateDisplay(currentStickyDate)}
          </div>
        )}
        {error && (
          <p className="text-red-500 text-center font-montserrat-bolder">
            {error}
          </p>
        )}
        <div className="space-y-8 w-full">
          {events.length === 0 && !error && !isSearchMode ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
            </div>
          ) : events.length === 0 && isSearchMode ? (
            <div className="flex flex-col justify-center items-center h-48 p-4">
              <div className="border border-white bg-black p-6 max-w-md w-full">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-white text-lg font-dela-gothic-one">
                    NO RESULTS
                  </p>
                  <FunnelIcon className="h-5 w-5 text-[#E4DD3B]" />
                </div>
                <div className="w-full border-t border-white/30 mb-3"></div>
                <p className="text-white/80 text-sm font-montserrat-medium mb-4">
                  Your search criteria did not match any events. Try adjusting
                  your filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="text-sm border border-[#E4DD3B] text-[#E4DD3B] px-4 py-1.5 transition-colors hover:bg-[#E4DD3B]/10 font-montserrat-medium w-full"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          ) : (

            events.map((event, index) => {
              const transformedUrl = getCloudinaryUrl(event.imageUrl, 320, 260);

              const notFirst = index !== 0;
              const eventDate = new Date(event.openTime);
              const eventDateStr = eventDate.toDateString(); // Get the event date in string format
              
              // Check if a new date row should be displayed
              const showDateMarquee = eventDateStr !== previousDate.current;
              //const showDateMarquee = true;
              if (showDateMarquee) {
                previousDate.current = eventDateStr; // Update the previousDate ref
              }

              

              const formattedDateTime = eventDate.toISOString().split('T')[0];

              const isSticky = currentStickyDate === formattedDateTime;

              

              return (

                <div>

                  {/* Changing non-sticky marquee */}
                  {showDateMarquee && notFirst && (
                    <div
                      ref={(el: HTMLDivElement | null) => {
                        if (el) {
                          dateRefs.current[formattedDateTime] = el;
                        }
                      }}
                      data-date={formattedDateTime}
                      className="w-full z-41 mb-4 pt-0 border-white font-dela-gothic-one bg-black text-white font-dela-gothic-one uppercase font-bold text-4xl tracking-wide text-left" 
                    >
                      {formatDateDisplay(formattedDateTime)}

                    </div>
                  )}

                 {showDateMarquee && !notFirst && (
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


                                  <div key={event.id} className="relative group mb-10 w-full">
                  <div className="absolute w-full h-full translate-x-2 translate-y-2 bg-[#E4DD3B] z-0 transition-transform duration-200 group-hover:-translate-x-0 group-hover:-translate-y-0"></div>
                  <div
                    className="relative z-10 bg-black text-white border border-white/70 p-5 font-montserrat-medium flex flex-col sm:flex-row cursor-pointer mb-10 w-full"
                    onClick={() => handleEventClick(event.id)}
                  >
                    <div className="absolute top-6 right-6 z-20 flex flex-col items-center space-y-2">
                      <div
                        className={`flex items-center justify-center bg-black/60 border border-white/40 h-8 w-8 rounded-full ${
                          likingEventIds.has(event.id)
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer hover:border-[#E4DD3B]/80 hover:bg-black/80"
                        } ${
                          event.likedByUser
                            ? "bg-[#E4DD3B]/10 border-[#E4DD3B]/70"
                            : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(event.id, event.likedByUser);
                        }}
                        title="Save this event"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill={event.likedByUser ? "#E4DD3B" : "none"}
                          stroke="#E4DD3B"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                        </svg>
                        {likingEventIds.has(event.id) && (
                          <svg
                            className="animate-spin h-3.5 w-3.5 text-white absolute"
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
                        )}
                      </div>

                      <a
                        href={event.fbLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center justify-center text-white font-montserrat-medium bg-black/60 border border-white/40 hover:border-[#E4DD3B]/80 hover:bg-black/80 transition-all h-8 w-8 rounded-full"
                        title="View on Facebook"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          stroke="#E4DD3B"
                          strokeWidth="1"
                          fill="none"
                        >
                          <rect
                            x="0.5"
                            y="0.5"
                            width="23"
                            height="23"
                            rx="1"
                            stroke="#E4DD3B"
                            fill="none"
                          />
                          <path
                            d="M16.5 12H13.5V9.5C13.5 8.5 14 8.25 14.5 8.25H16V5.5H13.5C11.5 5.5 10 7 10 9.5V12H8V15H10V23H13.5V15H15.75L16.5 12Z"
                            fill="#E4DD3B"
                          />
                        </svg>
                      </a>
                    </div>

                    {/* Event Image */}
                    <div className="relative sm:w-1/3 mb-4 sm:mb-0 sm:-ml-2">
                      <LazyLoadImage
                        src={transformedUrl}
                        alt={event.title}
                        effect="blur"
                        className="w-full h-48 sm:h-full object-cover border-2 border-[#E4DD3B]"
                      />
                    </div>

                    {/* Event Main Info */}
                    <div className="sm:w-1/3 flex flex-col justify-start sm:pl-12 mt-3 sm:mt-4 text-left group">
                      <h2 className="text-md sm:text-[1.35rem] font-dela-gothic-one text-white uppercase">
                        {event.title}
                      </h2>
                      <p
                        className="leading-[1.25] text-[0.9rem] sm:text-[1.0rem] text-balance text-white font-montserrat mt-3"
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
                      <p className="text-xs hidden sm:block sm:text-sm text-[#E4DD3B] font-montserrat-medium mt-2 transition-colors">
                        Read More →
                      </p>
                      </div>

                    {/* Event Side Info */}
                    <div className="sm:w-1/3 flex flex-col justify-between items-start pl-0 sm:pl-12 mt-4 sm:mt-0">
                      <div className="w-full mb-4">
                        {/* Location */}
                        <div className="flex items-center mt-2 sm:mt-4">
                          <svg
                            width="20"
                            height="20"

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
                          <p className="text-[1rem] sm:text-[1.05rem] text-white font-montserrat-medium ml-2.5">
                            {event.venue}
                          </p>
                        </div>

                        {/* Times */}
                        <div className="flex items-center mt-3 sm:mt-4">
                          <CalendarIcon className="h-5 w-5 text-[#E4DD3B]" />
                          <p className="text-[1rem] sm:text-[1.05rem] text-white font-montserrat-medium ml-2.5">
                            {new Date(event.openTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            })}{" "}
                            -{" "}
                            {new Date(event.closeTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            })}
                          </p>
                        </div>

                        {/* Ticket Price */}
                        <div className="flex items-center mt-3 sm:mt-4">
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 512 512"
                            fill="none"
                            stroke="#E4DD3B"
                            strokeWidth="0"
                            className="text-[#E4DD3B]"
                          >
                            <g fill="#E4DD3B" stroke="#E4DD3B" strokeWidth="10">
                              <path
                                d="M430.337,231.065H81.674c-29.701,0-53.858,24.16-53.858,53.862v49.884v15.976l15.806,2.262
                                c9.135,1.31,16.03,9.258,16.03,18.483c0,9.225-6.891,17.173-16.022,18.482l-15.814,2.262v15.978v49.892
                                c0,29.693,24.157,53.854,53.858,53.854h348.663c29.701,0,53.862-24.161,53.862-53.854v-49.558V391l-17.571-0.822
                                c-9.982-0.463-17.808-8.655-17.808-18.645c0-9.982,7.826-18.174,17.815-18.646l17.564-0.83v-17.58v-49.55
                                C484.199,255.225,460.038,231.065,430.337,231.065z M465.765,334.477c-19.686,0.936-35.371,17.14-35.371,37.056
                                c0,19.923,15.685,36.135,35.371,37.055v49.558c0,19.565-15.864,35.428-35.428,35.428H81.674c-19.569,0-35.432-15.863-35.432-35.428
                                v-49.892c17.991-2.579,31.836-18.011,31.836-36.722c0-18.703-13.846-34.135-31.836-36.721v-49.884
                                c0-19.573,15.863-35.436,35.432-35.436h348.663c19.564,0,35.428,15.863,35.428,35.436V334.477z"
                              />
                              <rect
                                x="133.621"
                                y="439.419"
                                width="12.19"
                                height="31.8"
                              />
                              <rect
                                x="133.621"
                                y="383.564"
                                width="12.19"
                                height="31.792"
                              />
                              <rect
                                x="133.621"
                                y="327.7"
                                width="12.19"
                                height="31.8"
                              />
                              <rect
                                x="133.621"
                                y="271.846"
                                width="12.19"
                                height="31.799"
                              />
                              <polygon points="111.245,180.758 100.592,186.68 116.053,214.461 126.702,208.539" />
                              <path
                                d="M497.524,179.025l-24.095-43.311l-8.558-15.36l-15.749,7.826c-8.948,4.442-19.768,1.09-24.617-7.639
                                c-4.865-8.721-2.001-19.687,6.492-24.95l14.952-9.266l-8.558-15.368l-24.088-43.294C398.863,1.714,366.006-7.658,340.047,6.79
                                L35.374,176.299c-25.955,14.44-35.318,47.305-20.878,73.256l0.875,1.578c3.27-6.394,7.43-12.243,12.324-17.409
                                c-4.803-15.643,1.762-33.044,16.636-41.326l304.681-169.51c17.1-9.518,38.674-3.368,48.192,13.732l24.088,43.302
                                c-16.751,10.38-22.575,32.182-12.895,49.582c9.681,17.401,31.271,23.942,48.925,15.172l24.095,43.312
                                c7.273,13.056,5.337,28.692-3.571,39.601c4.776,3.961,8.989,8.558,12.65,13.569C505.4,224.524,508.979,199.615,497.524,179.025z"
                              />
                            </g>
                          </svg>
                          <p className="text-[1rem] sm:text-[1.05rem] text-white font-montserrat-medium ml-2.5">
                            {event.ticket > 0 ? `€${event.ticket}` : "FREE"}
                          </p>
                        </div>

                        {/* People Saved/Bookmarked */}
                        <div className="flex items-center mt-3 sm:mt-4">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#E4DD3B"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                          </svg>
                          <p className="text-[1rem] sm:text-[1.05rem] text-white font-montserrat-medium ml-2.5">
                            {event.likeCount}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {hasMore && events.length > 0 && !fetchingRef.current && (
          <div className="flex justify-center mt-12 mb-12">
            <button
              onClick={() => setPage((prev) => prev + 1)}
              className="px-5 py-2 bg-transparent border border-[#E4DD3B] text-[#E4DD3B] font-montserrat-medium hover:bg-[#E4DD3B]/10 transition-all duration-200 text-sm tracking-wide"
            >
              Load More
            </button>
          </div>
        )}

        {fetchingRef.current && (
          <div className="flex justify-center mt-4 mb-8">
            <p className="text-white font-montserrat-bolder">
              Loading more events...
            </p>
          </div>
        )}

        {!hasMore && events.length > 0 && (
          <div className="flex justify-center mt-4 mb-8">
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
