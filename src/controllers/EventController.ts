import { Request, Response } from "express";
import {
  EventModel,
  EventRequestParams,
  EventSchema,
} from "../db/models/Event";
import { createEvent } from "../routes/createEvent/createEvent";
import { expressRouter } from "../expressApp";
import { UserModel } from "../db/models/User";
import { isEmpty } from "lodash";
import { getr2SignedUrl, getUserMediaAssetKey } from "../utils/fileUploadUtils";
export const EventController = {
  createEvent: expressRouter.post(
    "/create-event",
    async (req: Request, res: Response) => {
      const { eventData } = req.body;
      const eventCreationRes = await createEvent(eventData);
      res.send(eventCreationRes);
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
      const { userId, contentType } = req.query;

      if (!userId) {
        return res.status(400).send({
          success: false,
          message: "userId is required",
        });
      }

      const mediaAssetKey = getUserMediaAssetKey(userId as string);
      const signedUrl = await getr2SignedUrl(
        process.env.R2_COVER_IMAGE_BUCKET as string,
        mediaAssetKey,
        undefined,
        undefined,
        contentType as string
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
};
