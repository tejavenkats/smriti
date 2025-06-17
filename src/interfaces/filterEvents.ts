import { Event } from "../db/models/Event";
import { PaginatedResponse } from "./common";

export interface IFilterEventsPayload {
  userId: string;
  pageNo: number;
  pageSize: number;
  sortBy: string;
  sortOrder: string;
}

export interface IFilterEventsResponse {
  success: boolean;
  message: string;
  content: PaginatedResponse<Event>;
}
