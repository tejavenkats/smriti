import { Request, Response } from "express";
import { EventModel } from "../db/models/Event";
import { createEvent } from "../routes/events/createEvent";
import { expressRouter } from "../expressApp";
import { UserModel } from "../db/models/User";
import { isEmpty } from "lodash";
import {
  getEventQrCodeAssetKey,
  getr2SignedUrl,
  getUserMediaAssetKey,
} from "../utils/fileUploadUtils";
import { filterEvents } from "../routes/events/filterEvents";
export const EventController = {
  createEvent: expressRouter.post(
    "/create-event",
    async (req: Request, res: Response) => {
      const eventData = req.body;
      console.log("req body: ", req.body, eventData);

      const eventCreationRes = await createEvent(eventData);
      res.send(eventCreationRes);
    }
  ),
  updateEvent: expressRouter.put(
    "/update-event",
    async (req: Request, res: Response) => {
      const { eventId } = req.body;

      if (!eventId) {
        return res.status(400).send({
          success: false,
          message: "eventId is required",
        });
      }

      const updatedEvent = await EventModel.findOneAndUpdate(
        { eventId: eventId },
        {
          $set: req.body,
        }
      );

      return res.status(200).send({
        success: true,
        message: "Event updated successfully",
        event: updatedEvent,
      });
    }
  ),
  joinEvent: expressRouter.post(
    "/join-event",
    async (req: Request, res: Response) => {
      const { eventId, userId } = req.body;

      if (!eventId || !userId) {
        return res.status(400).send({
          success: false,
          message: "eventId and userId are required",
        });
      }

      const user = await UserModel.findOne({
        userId: userId,
      });

      if (isEmpty(user)) {
        return res.status(400).send({
          success: false,
          message: "User not found",
        });
      }

      const updatedEvent = await EventModel.findOneAndUpdate(
        { eventId: eventId },
        {
          $addToSet: { attendees: user },
        }
      );

      return res.status(200).send({
        success: true,
        message: "User joined successfully",
        event: updatedEvent,
      });
    }
  ),
  getEventAttendees: expressRouter.get(
    "/get-event-attendees",
    async (req: Request, res: Response) => {
      const { eventId, pageNo = 1, pageSize = 10 } = req.query;

      if (!eventId) {
        return res.status(400).send({
          success: false,
          message: "eventId is required",
        });
      }

      const event = await EventModel.findOne({
        eventId: eventId as string,
      }).populate({
        path: "attendees",
        options: {
          skip: (Number(pageNo) - 1) * Number(pageSize),
          limit: Number(pageSize),
        },
      });

      return res.status(200).send({
        success: true,
        message: "Attendees fetched successfully",
        attendees: event?.attendees,
      });
    }
  ),
  getSignedUrlForCoverImage: expressRouter.get(
    "/cover-image/get-signed-url",
    async (req: Request, res: Response) => {
      const { userId, extension } = req.query;

      if (!userId) {
        return res.status(400).send({
          success: false,
          message: "userId is required",
        });
      }

      // const signedUrl = await getr2SignedUrl("events", eventQrAssetKey);

      const mediaAssetKey = getUserMediaAssetKey(
        userId as string,
        extension as string
      );
      console.log("cover photos key", process.env.R2_COVER_IMAGE_BUCKET);

      const signedUrl = await getr2SignedUrl(
        process.env.R2_COVER_IMAGE_BUCKET as string,
        mediaAssetKey
      );

      if (!signedUrl) {
        return res.status(500).send({
          success: false,
          message: "Failed to get signed url",
        });
      }

      const response = {
        success: true,
        key: mediaAssetKey,
        url: signedUrl,
      };

      res.status(200).send(response);
    }
  ),
  getCoverImageDownloadUrl: expressRouter.get(
    "/cover-image/get-download-url",
    async (req: Request, res: Response) => {
      const { assetKey } = req.query;

      if (!assetKey) {
        return res.status(400).send({
          success: false,
          message: "assetKey is required",
        });
      }

      const signedUrl = await getr2SignedUrl(
        process.env.R2_COVER_IMAGE_BUCKET as string,
        assetKey as string,
        "get"
      );

      if (!signedUrl) {
        return res.status(500).send({
          success: false,
          message: "Failed to get signed url",
        });
      }

      const response = {
        success: true,
        url: signedUrl,
      };
      res.status(200).send(response);
    }
  ),

  filterEvents: expressRouter.get(
    "/filter-events",
    async (req: Request, res: Response) => {
      const {
        userId,
        pageNo = "1",
        pageSize = "10",
        sortBy = "date",
        sortOrder = "asc",
      } = req.query;

      if (!userId) {
        return res.status(400).send({
          success: false,
          message: "userId is required",
        });
      }

      const paginatedEventsList = await filterEvents({
        userId: userId as string,
        pageNo: Number(pageNo),
        pageSize: Number(pageSize),
        sortBy: sortBy as string,
        sortOrder: sortOrder as string,
      });

      return res.status(200).send(paginatedEventsList);
    }
  ),
};
