import { Event, EventModel } from "../../db/models/Event";
import { PaginatedResponse } from "../../interfaces/common";
import { IFilterEventsPayload } from "../../interfaces/filterEvents";

export const filterEvents = async (payload: IFilterEventsPayload) => {
  const {
    userId,
    pageNo = 1,
    pageSize = 10,
    sortBy = "createdOn",
    sortOrder = "desc",
  } = payload;
  const filter: any = {
    userId: userId as string,
    $or: [{ deletedOn: null }, { deletedOn: { $exists: false } }],
  };
  const page = pageNo;
  const limit = pageSize;
  const skip = (page - 1) * limit;

  const sort: any = {};
  sort[sortBy as string] = sortOrder === "desc" ? -1 : 1;

  const [events, total] = await Promise.all([
    EventModel.find(filter)
      .select("-_id -__v")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    EventModel.countDocuments(filter),
  ]);
  const paginatedResonse: PaginatedResponse<Event> = {
    data: events,
    total,
    pageSize: limit,
    pageNo: page,
    totalPage: Math.ceil(total / limit),
  };
  const response = {
    success: true,
    message: "Events filtered successfully",
    content: paginatedResonse,
  };
  return response;
};
