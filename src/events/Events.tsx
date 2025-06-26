import { FC, useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../authentication/AuthContext.tsx";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import "../index.css";
import Footer from "../shared/Footer.tsx";
import FilterBar from "./FilterBar.tsx";
import { TopPickEvents } from "./TopPicks.tsx";
import { likeEvent, unlikeEvent } from "../shared/reducers/like.ts";
import { FunnelIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { useEvents, useEventSearch } from "./useEvents";
import {
  getScrollPosition,
  clearScrollPosition,
  queryKeys,
} from "../shared/queryClient";
import { useQueryClient } from "@tanstack/react-query";
import { Event } from "../shared/reducers/event";
import { PageableResponse } from "../shared/helpers";

const cld = new Cloudinary({ cloud: { cloudName: "dgptexs0w" } });

const getCloudinaryUrl = (publicId: string, width: number, height: number) => {
  return cld.image(publicId).resize(fill().width(width).height(height)).toURL();
};

const DateSkeleton = () => (
  <div className="xs:w-100 md:w-150 lg:w-160 2xl:w-260 mx-auto">
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

interface InfiniteEventsData {
  pages: PageableResponse<Event>[];
  pageParams: number[];
}

const Events: FC = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const { user } = useAuth();
  const [isSearchMode, setIsSearchMode] = useState<boolean>(false);
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

  const filters = {
    searchText,
    filterDate,
    filterVenue,
    filterPrice,
    sortByLikes,
    page: 0,
  };

  // Restore filters from saved state
  useEffect(() => {
    const savedPosition = getScrollPosition();
    if (savedPosition?.filters) {
      const { filters: savedFilters } = savedPosition;
      setSearchText(savedFilters.searchText);
      setFilterDate(savedFilters.filterDate);
      setFilterVenue(savedFilters.filterVenue);
      setFilterPrice(savedFilters.filterPrice);
      setSortByLikes(savedFilters.sortByLikes);
      if (Object.values(savedFilters).some((value) => value)) {
        setIsSearchMode(true);
      }
    }
  }, []);

  const {
    events: regularEvents,
    fetchNextPage: fetchNextRegularPage,
    hasNextPage: hasNextRegularPage,
    isFetchingNextPage: isFetchingNextRegularPage,
    isError: isErrorRegular,
    error: errorRegular,
    saveState,
  } = useEvents();

  const {
    data: searchData,
    fetchNextPage: fetchNextSearchPage,
    hasNextPage: hasNextSearchPage,
    isFetchingNextPage: isFetchingNextSearchPage,
    isError: isErrorSearch,
    error: errorSearch,
  } = useEventSearch(filters);

  const events = useMemo(
    () =>
      isSearchMode
        ? searchData?.pages.flatMap((page) => page.content) ?? []
        : regularEvents,
    [isSearchMode, searchData?.pages, regularEvents]
  );

  const hasMore = isSearchMode ? hasNextSearchPage : hasNextRegularPage;
  const isFetchingNext = isSearchMode
    ? isFetchingNextSearchPage
    : isFetchingNextRegularPage;
  const isError = isSearchMode ? isErrorSearch : isErrorRegular;
  const error = isSearchMode ? errorSearch : errorRegular;

  const fetchNextPage = useCallback(() => {
    if (isSearchMode) {
      fetchNextSearchPage();
    } else {
      fetchNextRegularPage();
    }
  }, [isSearchMode, fetchNextSearchPage, fetchNextRegularPage]);

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
    // Save current state before navigating
    saveState(filters);
    navigate(`/events/${eventId}?t=${Date.now()}`);
  };

  useEffect(() => {
    const handleResize = () => {
      // Perform any responsive logic if needed
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const queryClient = useQueryClient();

  const handleLike = async (eventId: string, liked: boolean) => {
    if (!user) {
      navigate("/auth?mode=login");
      return;
    }
    if (likingEventIds.has(eventId)) return;

    setLikingEventIds((prev) => {
      const newSet = new Set(prev);
      newSet.add(eventId);
      return newSet;
    });

    try {
      const idToken = await user.getIdToken();
      const userId = user.uid;

      // Optimistically update the cache
      if (isSearchMode) {
        queryClient.setQueriesData(
          {
            queryKey: queryKeys.events.search({ ...filters, city: cityParam }),
          },
          (oldData: InfiniteEventsData | undefined) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                content: page.content.map((event) => {
                  if (event.id === eventId) {
                    return {
                      ...event,
                      likedByUser: !liked,
                      likeCount: liked
                        ? event.likeCount - 1
                        : event.likeCount + 1,
                    };
                  }
                  return event;
                }),
              })),
            };
          }
        );
      } else {
        queryClient.setQueriesData(
          { queryKey: queryKeys.events.list(cityParam) },
          (oldData: InfiniteEventsData | undefined) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                content: page.content.map((event) => {
                  if (event.id === eventId) {
                    return {
                      ...event,
                      likedByUser: !liked,
                      likeCount: liked
                        ? event.likeCount - 1
                        : event.likeCount + 1,
                    };
                  }
                  return event;
                }),
              })),
            };
          }
        );
      }

      // Make API call
      await (liked
        ? unlikeEvent(eventId, userId, idToken)
        : likeEvent(eventId, userId, idToken));

      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
    } catch (err) {
      console.error("Error toggling like:", err);
      alert("Failed to update like status. Please try again.");

      // Revert optimistic update on error
      if (isSearchMode) {
        queryClient.setQueriesData(
          {
            queryKey: queryKeys.events.search({ ...filters, city: cityParam }),
          },
          (oldData: InfiniteEventsData | undefined) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                content: page.content.map((event) => {
                  if (event.id === eventId) {
                    return {
                      ...event,
                      likedByUser: liked,
                      likeCount: liked ? event.likeCount : event.likeCount - 1,
                    };
                  }
                  return event;
                }),
              })),
            };
          }
        );
      } else {
        queryClient.setQueriesData(
          { queryKey: queryKeys.events.list(cityParam) },
          (oldData: InfiniteEventsData | undefined) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                content: page.content.map((event) => {
                  if (event.id === eventId) {
                    return {
                      ...event,
                      likedByUser: liked,
                      likeCount: liked ? event.likeCount : event.likeCount - 1,
                    };
                  }
                  return event;
                }),
              })),
            };
          }
        );
      }
    } finally {
      setLikingEventIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
    }
  };

  const fetchVenues = useCallback(async () => {
    try {
      const config: { headers?: Record<string, string> } = {};
      if (user) {
        const idToken = await user.getIdToken();
        config.headers = { Authorization: `Bearer ${idToken}` };
      }

      if (events.length > 0) {
        const uniqueVenues = Array.from(
          new Set(events.map((event) => event.venue))
        );
        setVenues(uniqueVenues);
      }
    } catch (err) {
      console.error("Error fetching venues:", err);
    }
  }, [events, user]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const [currentStickyDate, setCurrentStickyDate] = useState<string>("");
  const dateRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const previousDate = useRef<string>("");

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      // Only process scroll events if we have events to display
      if (events.length === 0 || (isSearchMode && events.length === 0)) {
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
  }, [events, isSearchMode, currentStickyDate]);

  // Also clear the sticky date when filters are applied and no results are found
  useEffect(() => {
    if (isSearchMode && events.length === 0) {
      setCurrentStickyDate("");
    }
  }, [isSearchMode, events.length]);

  const formatDateDisplay = (dateStr: string): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const clearFilters = () => {
    setSearchText("");
    setFilterDate("");
    setFilterVenue("");
    setFilterPrice("");
    setSortByLikes("");
    setIsSearchMode(false);
    clearScrollPosition(); // Clear saved state when filters are cleared
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setIsSearchMode(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <TopPickEvents />

      <div className="pt-8 pb-4 sm:py-8 sm:max-w-6xl w-full sm:mx-auto px-4 sm:px-8">
        <div className="flex flex-col items-center justify-center text-white font-dela-gothic-one font-bold">
          <span className="mb-0 font-montserrat-bolder text-[0.8rem] 2xl:text-[1.2rem]">
            {cityParam}, Estonia
          </span>
          <h1 className="text-2xl 2xl:text-[2.4rem]">
            {currentTime.toLocaleTimeString("en-GB", {
              timeZone: "Europe/Tallinn",
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </h1>
          <div className="mt-4 w-60 xs:w-100 md:w-150 lg:w-160 2xl:w-260 border-t-2 border-[#E4DD3B]"></div>
        </div>
      </div>

      <div className="w-full bg-black/95 backdrop-blur-sm py-2">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8">
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
            onApplyFilters={() => {
              setIsSearchMode(true);
              window.scrollTo(0, 0);
            }}
            onClearFilters={clearFilters}
            onSearchKeyPress={handleSearchKeyPress}
            fetchVenues={fetchVenues}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {events.length === 0 && isSearchMode ? (
          <div className="flex justify-center items-center flex-grow px-4 py-12">
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
          <div className="flex-1 px-4 sm:px-4">
            {currentStickyDate &&
              events.length > 0 &&
              !(isSearchMode && events.length === 0) && (
                <div className="xs:w-100 md:w-150 lg:w-160 2xl:w-260 mx-auto sticky top-[3.5rem] 2xl:top-[3.5rem] z-40 py-1 2xl:py-2 bg-black text-[#fff] font-dela-gothic-one uppercase font-bold text-xl 2xl:text-3xl tracking-wide text-left">
                  {formatDateDisplay(currentStickyDate)}
                </div>
              )}

            {isError && (
              <p className="text-red-500 text-center font-montserrat-bolder">
                {error?.message || "An error occurred while fetching events."}
              </p>
            )}

            <div className="space-y-8 w-full justify-items-center">
              {events.length === 0 && !isError && !isSearchMode ? (
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
                    <div
                      className="xs:w-100 md:w-150 lg:w-160 2xl:w-260 mx-auto"
                      key={event.id}
                    >
                      {showDateMarquee && notFirst && events.length > 0 && (
                        <div
                          ref={(el: HTMLDivElement | null) => {
                            if (el) {
                              dateRefs.current[formattedDateTime] = el;
                            }
                          }}
                          data-date={formattedDateTime}
                          className="w-full z-41 mb-2 border-white font-dela-gothic-one bg-black text-white font-dela-gothic-one uppercase font-bold text-xl 2xl:text-3xl tracking-wide text-left"
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

                      <div className="relative group mb-10 w-full">
                        <div className="absolute w-full h-[400px] sm:h-[300px] translate-x-2 translate-y-2 bg-[#E4DD3B] z-0 transition-transform duration-200 group-hover:-translate-x-0 group-hover:-translate-y-0" />
                        <div
                          className="relative z-10 bg-black text-white border border-white/70 p-5 md:pb-2 2xl:pb-5 font-montserrat-medium flex flex-col sm:flex-row w-full h-[500px] sm:h-[300px] cursor-pointer"
                          onClick={() => handleEventClick(event.id)}
                        >
                          {/* Image Container */}
                          <div className="relative w-full sm:w-1/3 h-48 sm:h-full mb-4 sm:-ml-2 sm:-mt-2">
                            <div className="w-full h-full bg-white/10 relative">
                              <LazyLoadImage
                                src={transformedUrl}
                                alt={event.title}
                                effect="blur"
                                className="absolute inset-0 w-full h-full object-cover border-2 border-[#E4DD3B]"
                                wrapperClassName="!absolute inset-0 w-full h-full"
                              />
                            </div>
                          </div>

                          {/* Main Info */}
                          <div className="w-full sm:w-1/3 flex flex-col justify-start pl-0 sm:pl-12 md:pl-6 2xl:pl-12 mt-3 sm:mt-1 text-left">
                            <h2 className="text-md sm:text-[1rem] md:text-[0.9rem] 2xl:text-[1.5rem] font-dela-gothic-one text-white uppercase truncate pr-8 sm:pr-0">
                              {event.title}
                            </h2>
                            <div className="flex-grow overflow-hidden">
                              <p
                                className="leading-[1.25] text-[0.7rem] sm:text-[0.65rem] 2xl:text-[0.9rem] text-balance text-white font-montserrat mt-3 line-clamp-4 sm:line-clamp-5"
                                style={{ wordSpacing: "0.03em" }}
                              >
                                {event.description}
                              </p>
                            </div>
                            <p className="text-xs hidden sm:block sm:text-xs 2xl:text-sm text-[#E4DD3B] font-montserrat-medium mt-2 transition-colors">
                              Read More →
                            </p>
                          </div>

                          {/* Side Info */}
                          <div className="text-[0.8rem] sm:text-[0.7rem] md:text-[0.7rem] 2xl:text-[1rem] w-full sm:w-1/3 flex flex-col justify-between pl-0 sm:pl-8 md:pl-4 2xl:pl-8 mt-4 sm:mt-4">
                            <div className="w-full flex flex-col justify-between h-full">
                              <div className="space-y-3">
                                {/* Location */}
                                <div className="flex items-center">
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="w-4 h-4 sm:w-5 sm:h-5 text-[#E4DD3B]"
                                  >
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                  </svg>
                                  <p className="text-white font-montserrat-medium ml-2.5 truncate">
                                    {event.venue}
                                  </p>
                                </div>

                                {/* Times */}
                                <div className="flex items-center">
                                  <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#E4DD3B]" />
                                  <p className="text-white font-montserrat-medium ml-2.5 truncate">
                                    {new Date(
                                      event.openTime
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: false,
                                    })}{" "}
                                    -{" "}
                                    {new Date(
                                      event.closeTime
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: false,
                                    })}
                                  </p>
                                </div>

                                {/* Ticket Price */}
                                <div className="flex items-center">
                                  <svg
                                    width="22"
                                    height="22"
                                    viewBox="0 0 512 512"
                                    fill="none"
                                    stroke="#E4DD3B"
                                    strokeWidth="0"
                                    className="text-[#E4DD3B]"
                                  >
                                    <g
                                      fill="#E4DD3B"
                                      stroke="#E4DD3B"
                                      strokeWidth="10"
                                    >
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
                                  <p className="text-white font-montserrat-medium ml-2.5">
                                    {event.ticket > 0
                                      ? `€${event.ticket}`
                                      : "FREE"}
                                  </p>
                                </div>

                                {/* People Saved */}
                                <div className="flex items-center">
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#E4DD3B"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="w-4 h-4 sm:w-5 sm:h-5"
                                  >
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                  </svg>
                                  <p className="text-white font-montserrat-medium ml-2.5">
                                    {event.likeCount}
                                  </p>
                                </div>
                              </div>

                              {/* Facebook Link */}
                              <a
                                href={event.fbLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center mt-4 sm:mt-auto pt-3 border-t border-white/10 cursor-pointer hover:text-[#E4DD3B] transition-colors"
                                title="View on Facebook"
                              >
                                <div className="flex items-center justify-center h-4 w-4 sm:h-6 sm:w-6 text-[#E4DD3B]">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-4 h-4 sm:w-6 sm:h-6"
                                  >
                                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.125v-3.622h3.125v-2.672c0-3.097 1.894-4.785 4.659-4.785 1.325 0 2.463.099 2.794.143v3.24h-1.918c-1.504 0-1.796.715-1.796 1.762v2.312h3.592l-.467 3.622h-3.125v9.294h6.125c.731 0 1.324-.593 1.324-1.324v-21.351c0-.732-.593-1.325-1.324-1.325z" />
                                  </svg>
                                </div>
                                <span className="text-inherit font-montserrat-medium ml-2.5 transition-colors text-[0.7rem] sm:text-[0.9rem]">
                                  Facebook Event
                                </span>
                              </a>
                            </div>
                          </div>

                          {/* Save button */}
                          <div className="absolute top-2 right-2 sm:top-4 sm:right-3 2xl:top-6 2xl:right-6 z-20">
                            <div
                              className={`flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-full border-2 border-[#E4DD3B] hover:bg-[#E4DD3B]/10 transition-colors ${
                                likingEventIds.has(event.id)
                                  ? "opacity-50 cursor-not-allowed"
                                  : "cursor-pointer"
                              } ${
                                event.likedByUser
                                  ? "bg-[#E4DD3B]/10"
                                  : "bg-black"
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
                                className="w-3 h-3 sm:w-4 sm:h-4"
                              >
                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                              </svg>
                              {likingEventIds.has(event.id) && (
                                <svg
                                  className="animate-spin h-3 w-3 sm:h-4 sm:w-4 text-white absolute"
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
                          </div>
                        </div>
                      </div>
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
        )}
      </div>

      <div className="mt-20 sm:mt-32">
        <Footer />
      </div>
    </div>
  );
};

export default Events;
