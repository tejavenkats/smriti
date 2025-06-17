import { isEmpty } from "lodash";
import { UserModel, UserNuxStatus } from "../db/models/User";
import { expressRouter } from "../expressApp";
import { ICompleteNuxReq } from "../interfaces/completeNux";

export const UserController = {
  updateUserNuxStatus: expressRouter.post(
    "/update-user-nux-status",
    async (req, res) => {
      const { userId, username } = req.body as ICompleteNuxReq;
      console.log("body: ", req.body);

      if (!userId || !username) {
        return res.status(400).send({
          success: false,
          message: "userId and username are required",
        });
      }

      const getNuxStatus = () => {
        if (!!userId && !!username) {
          return UserNuxStatus.COMPLETED;
        }
        return UserNuxStatus.PENDING;
      };

      const user = await UserModel.findOneAndUpdate(
        {
          userId: userId,
        },
        {
          $set: {
            name: username,
            nuxCompletionTimeStamp: new Date().getTime(),
            nuxStatus: getNuxStatus(),
          },
        },
        { new: true }
      );

      console.log("user: ", user);

      if (isEmpty(user)) {
        return res.status(400).send({
          success: false,
          message: "User not found",
        });
      }
      return res.status(200).send({
        success: true,
        message: "Nux completed successfully",
        username: user?.name,
        nuxStatus: UserNuxStatus.COMPLETED,
      });
    }
  ),
  getUserNuxStatus: expressRouter.get(
    "/get-user-nux-status",
    async (req, res) => {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).send({
          success: false,
          message: "userId is required",
        });
      }

      const user = await UserModel.findOne({
        userId: userId as string,
      });

      if (isEmpty(user)) {
        return res.status(400).send({
          success: false,
          message: "User not found",
        });
      }
      return res.status(200).send({
        success: true,
        nuxStatus: user?.nuxStatus,
        nuxCompletionTimeStamp: user?.nuxCompletionTimeStamp,
      });
    }
  ),
  getUserByPhone: expressRouter.get("/get-user-by-phone", async (req, res) => {
    const { phone, countryCode } = req.query;

    if (!phone || !countryCode) {
      return res.status(400).send({
        success: false,
        message: "phone is required",
      });
    }
    const user = await UserModel.findOne({
      phone: phone as string,
      countryCode: countryCode as string,
    });

    if (isEmpty(user)) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    console.log("user: ", user);

    return res.status(200).send({
      success: true,
      userData: user,
    });
  }),
};
