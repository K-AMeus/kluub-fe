import { QueryClient } from "@tanstack/react-query";
import { getEvent, getEventsByCity, searchEvents } from "./reducers/event";
import { User } from "firebase/auth";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
      gcTime: 1000 * 60 * 30, // Cache is kept for 30 minutes
    },
  },
});

// Types for filters
export interface EventsFilters {
  searchText: string;
  filterDate: string;
  filterVenue: string;
  filterPrice: string;
  sortByLikes: string;
  page: number;
}

// Keys for React Query
export const queryKeys = {
  events: {
    all: ["events"] as const,
    list: (city: string) => [...queryKeys.events.all, "list", city] as const,
    search: (params: EventsFilters & { city: string }) =>
      [...queryKeys.events.all, "search", params] as const,
    detail: (id: string) => [...queryKeys.events.all, "detail", id] as const,
  },
};

// Types for scroll position
export interface EventsScrollPosition {
  scrollY: number;
  filters: EventsFilters;
}

// Function to fetch events with auth
export const fetchEventsWithAuth = async (
  city: string,
  page: number,
  size: number,
  user?: User | null
) => {
  if (user) {
    await user.getIdToken(); // Keep for future auth implementation
  }
  return getEventsByCity(city, page, size);
};

// Function to fetch event details with auth
export const fetchEventWithAuth = async (
  eventId: string,
  user?: User | null
) => {
  if (user) {
    await user.getIdToken(); // Keep for future auth implementation
  }
  return getEvent(eventId, user?.uid);
};

// Function to search events with auth
export const searchEventsWithAuth = async (
  params: EventsFilters & { city: string; page: number; size: number },
  user?: User | null
) => {
  if (user) {
    await user.getIdToken(); // Keep for future auth implementation
  }

  // Transform filters to API parameters
  const apiParams = {
    city: params.city,
    venue: params.filterVenue || undefined,
    startDate: params.filterDate || undefined,
    searchText: params.searchText || undefined,
    priceSort: params.filterPrice
      ? (params.filterPrice as "asc" | "desc")
      : undefined,
    likesSort: params.sortByLikes
      ? (params.sortByLikes as "asc" | "desc")
      : undefined,
    page: params.page,
    size: params.size,
  };

  return searchEvents(apiParams);
};

// Store for scroll position and filters
const SCROLL_STORAGE_KEY = "eventsScrollPosition";

export const saveScrollPosition = (position: EventsScrollPosition) => {
  sessionStorage.setItem(SCROLL_STORAGE_KEY, JSON.stringify(position));
};

export const getScrollPosition = (): EventsScrollPosition | null => {
  const stored = sessionStorage.getItem(SCROLL_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
};

export const clearScrollPosition = () => {
  sessionStorage.removeItem(SCROLL_STORAGE_KEY);
};
