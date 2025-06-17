import { isEmpty } from "lodash";
import { UserModel } from "../db/models/User";
import { expressRouter } from "../expressApp";
import { getUserMediaAssetKey, getr2SignedUrl } from "../utils/fileUploadUtils";

export const MediaController = {
  getSignedUrl: expressRouter.get("/get-signed-url", async (req, res) => {
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

    const mediaAssetKey = getUserMediaAssetKey(userId as string);
    const signedUrl = await getr2SignedUrl(
      process.env.R2_USER_MEDIA_BUCKET as string,
      mediaAssetKey
    );

    if (!signedUrl) {
      return res.status(500).send({
        success: false,
        message: "Couldn't generate signed URL",
      });
    }

    const response = {
      success: true,
      key: mediaAssetKey,
      url: signedUrl,
    };

    res.status(200).send(response);
  }),

  updateUserAssets: expressRouter.post(
    "/update-user-assets",
    async (req, res) => {
      const { userId, assetKey } = req.body;

      if (!userId || !assetKey) {
        return res.status(400).send({
          success: false,
          message: "userId and assetKey are required",
        });
      }

      const user = await UserModel.findOneAndUpdate(
        { userId: userId },
        {
          $push: {
            mediaUploads: assetKey,
          },
        },
        {
          new: true,
        }
      );

      if (isEmpty(user)) {
        return res.status(400).send({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).send({
        success: true,
      });
    }
  ),

  getUserAssetSignedUrl: expressRouter.get(
    "/get-user-assets",
    async (req, res) => {
      const { assetKey } = req.query;

      if (!assetKey) {
        return res.status(400).send({
          success: false,
          message: "assetKey is required",
        });
      }

      const signedUrl = await getr2SignedUrl(
        process.env.R2_USER_MEDIA_BUCKET as string,
        assetKey as string,
        "get"
      );

      if (!signedUrl) {
        return res.status(500).send({
          success: false,
          message: "Couldn't generate signed URL",
        });
      }

      res.status(200).send({
        success: true,
        url: signedUrl,
      });
    }
  ),

  getAssetDownloadUrl: expressRouter.get(
    "/get-asset-download-url",
    async (req, res) => {
      const { assetKey, bucketName } = req.query;

      if (!assetKey || !bucketName) {
        return res.status(400).send({
          success: false,
          message: "assetKey and bucketName are required",
        });
      }

      const signedUrl = await getr2SignedUrl(
        bucketName as string,
        assetKey as string,
        "get"
      );

      if (!signedUrl) {
        return res.status(500).send({
          success: false,
          message: "Couldn't generate signed URL",
        });
      }

      res.status(200).send({
        success: true,
        url: signedUrl,
      });
    }
  ),
};
