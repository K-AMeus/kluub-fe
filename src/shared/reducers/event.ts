import axios from "axios";
import { PageableResponse } from "../helpers.ts";
import axiosClient from "../../authentication/axiosClient.ts";

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  likeCount: number;
  imageUrl: string;
  fbLink: string;
  ticket: number;
  openTime: string;
  closeTime: string;
  topPick: boolean;
}

export const getAllEvents = async (
  page: number = 0,
  size: number = 10
): Promise<PageableResponse<Event>> => {
  const response = await axiosClient.get(
    `/api/event-service/v1/events?page=${page}&size=${size}`
  );
  return response.data;
};

export const getEvent = async (eventId: string): Promise<Event> => {
  const response = await axiosClient.get(
    `/api-event-service/v1/events/${eventId}`
  );
  return response.data;
};
