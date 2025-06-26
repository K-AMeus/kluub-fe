import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useAuth } from "../authentication/AuthContext";
import {
  queryKeys,
  fetchEventsWithAuth,
  fetchEventWithAuth,
  searchEventsWithAuth,
  EventsFilters,
  saveScrollPosition,
  getScrollPosition,
  clearScrollPosition,
} from "../shared/queryClient";
import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Event } from "../shared/reducers/event";
import { PageableResponse } from "../shared/helpers";

export const useEvents = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const cityParam = searchParams.get("city") || "Tartu";
  const scrollPositionRef = useRef<number>(0);
  const isRestoringScrollRef = useRef(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery<PageableResponse<Event>, Error>({
    queryKey: queryKeys.events.list(cityParam),
    queryFn: ({ pageParam }) =>
      fetchEventsWithAuth(cityParam, pageParam as number, 10, user),
    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined;
      return lastPage.pageable.pageNumber + 1;
    },
    enabled: !isRestoringScrollRef.current,
    initialPageParam: 0,
  });

  // Save scroll position and filters when leaving the page
  const saveState = (filters: EventsFilters) => {
    scrollPositionRef.current = window.scrollY;
    saveScrollPosition({
      scrollY: window.scrollY,
      filters,
    });
  };

  // Restore scroll position when returning to the page
  useEffect(() => {
    const savedPosition = getScrollPosition();
    if (savedPosition) {
      isRestoringScrollRef.current = true;
      // Restore scroll position after data is loaded
      const timer = setTimeout(() => {
        window.scrollTo(0, savedPosition.scrollY);
        isRestoringScrollRef.current = false;
        clearScrollPosition();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  return {
    events: data?.pages.flatMap((page) => page.content) ?? [],
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    saveState,
  };
};

export const useEventSearch = (filters: EventsFilters) => {
  const { user } = useAuth();
  const [urlSearchParams] = useSearchParams();
  const cityParam = urlSearchParams.get("city") || "Tartu";

  const queryParams = {
    ...filters,
    city: cityParam,
  };

  return useInfiniteQuery<PageableResponse<Event>, Error>({
    queryKey: queryKeys.events.search(queryParams),
    queryFn: ({ pageParam }) =>
      searchEventsWithAuth(
        {
          ...queryParams,
          page: pageParam as number,
          size: 10,
        },
        user
      ),
    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined;
      return lastPage.pageable.pageNumber + 1;
    },
    initialPageParam: 0,
    enabled: Boolean(
      filters.searchText ||
        filters.filterDate ||
        filters.filterVenue ||
        filters.filterPrice ||
        filters.sortByLikes
    ),
  });
};

export const useEventDetail = (eventId: string) => {
  const { user } = useAuth();

  return useQuery<Event, Error>({
    queryKey: queryKeys.events.detail(eventId),
    queryFn: () => fetchEventWithAuth(eventId, user),
  });
};
