import { PageableResponse } from "../helpers.ts";
import axiosClient from "../../authentication/axiosClient.ts";

export interface Event {
  id: string;
  title: string;
  description: string;
  venue: string;
  city: string;
  likeCount: number;
  imageUrl: string;
  fbLink: string;
  ticket: number;
  openTime: string;
  closeTime: string;
  topPick: boolean;
  likedByUser: boolean;
}

export const getEventsByCity = async (
  city: string,
  page: number = 0,
  size: number = 10
): Promise<PageableResponse<Event>> => {
  const response = await axiosClient.get(
    `/api/event-service/v1/events?city=${city}&page=${page}&size=${size}`
  );
  return response.data;
};

export const getEvent = async (
  eventId: string,
  userId?: string
): Promise<Event> => {
  const url = userId
    ? `/api/event-service/v1/events/${eventId}?userId=${userId}`
    : `/api/event-service/v1/events/${eventId}`;

  const response = await axiosClient.get(url);
  return response.data;
};

export const getTopPickEvents = async (): Promise<PageableResponse<Event>> => {
  const response = await axiosClient.get(
    `/api/event-service/v1/events/top-picks`
  );
  return response.data;
};

export const createEvent = async (
  eventData: Omit<Event, "id">,
  file?: File
): Promise<Event> => {
  const jsonBlob = new Blob([JSON.stringify(eventData)], {
    type: "application/json",
  });

  const formData = new FormData();
  formData.append("event", jsonBlob);

  if (file) {
    formData.append("image", file, file.name);
  }

  const response = await axiosClient.post(
    "/api/event-service/v1/events",
    formData
  );

  return response.data;
};

export const searchEvents = async (params: {
  city: string;
  venue?: string;
  startDate?: string;
  endDate?: string;
  searchText?: string;
  priceSort?: "asc" | "desc";
  likesSort?: "asc" | "desc";
  page?: number;
  size?: number;
}): Promise<PageableResponse<Event>> => {
  const queryParams = new URLSearchParams();

  queryParams.append("city", params.city);

  if (params.venue) queryParams.append("venue", params.venue);
  if (params.startDate) queryParams.append("startDate", params.startDate);
  if (params.endDate) queryParams.append("endDate", params.endDate);
  if (params.searchText) queryParams.append("searchText", params.searchText);
  if (params.priceSort) queryParams.append("priceSort", params.priceSort);
  if (params.likesSort) queryParams.append("likesSort", params.likesSort);

  if (params.page !== undefined)
    queryParams.append("page", params.page.toString());
  if (params.size !== undefined)
    queryParams.append("size", params.size.toString());

  const response = await axiosClient.get(
    `/api/event-service/v1/events/search?${queryParams.toString()}`
  );

  return response.data;
};
