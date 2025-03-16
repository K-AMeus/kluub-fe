import axiosClient from "../../authentication/axiosClient";
import { PageableResponse } from "../helpers";
import { Event } from "./event";

export const likeEvent = async (
  eventId: string,
  userId: string,
  idToken: string
) => {
  const response = await axiosClient.post(
    `/api/event-service/v1/events/${eventId}/likes?userId=${userId}`,
    {},
    { headers: { Authorization: `Bearer ${idToken}` } }
  );
  return response.data;
};

export const unlikeEvent = async (
  eventId: string,
  userId: string,
  idToken: string
) => {
  const response = await axiosClient.delete(
    `/api/event-service/v1/events/${eventId}/likes?userId=${userId}`,
    { headers: { Authorization: `Bearer ${idToken}` } }
  );
  return response.data;
};

export const getLikedEvents = async (
  userId: string,
  page: number = 0,
  size: number = 10
): Promise<PageableResponse<Event>> => {
  const response = await axiosClient.get(
    `/api/event-service/v1/events/liked?userId=${userId}&page=${page}&size=${size}`
  );
  return response.data;
};
