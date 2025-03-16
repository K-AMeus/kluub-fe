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

export const getEvent = async (eventId: string): Promise<Event> => {
  const response = await axiosClient.get(
    `/api/event-service/v1/events/${eventId}`
  );
  return response.data;
};

export const getTopPickEvents = async (): Promise<PageableResponse<Event>> => {
  const response = await axiosClient.get(
    `/api/event-service/v1/events/filter/top-picks`
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
