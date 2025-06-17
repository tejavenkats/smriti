import swaggerUi from "swagger-ui-express";
import specs from "./swagger/swaggerConfig";
import { connectSmriti } from "./db/dbConnect";
import { app, expressRouter } from "./expressApp";
import express from "express";

import cors from "cors";
import { OtpController } from "./controllers/OtpController";
import { UserController } from "./controllers/UserController";
import { MediaController } from "./controllers/MediaController";
import { EventController } from "./controllers/EventController";
const port = 3000;

connectSmriti();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(express.json());
app.use(cors());
app.use(OtpController.requestOtp);
app.use(OtpController.verifyOtp);
app.use(UserController.getUserNuxStatus);
app.use(UserController.updateUserNuxStatus);
app.use(UserController.getUserByPhone);
app.use(MediaController.getSignedUrl);
app.use(MediaController.updateUserAssets);
app.use(MediaController.getAssetDownloadUrl);
app.use(EventController.getSignedUrlForCoverImage);
app.use(EventController.getCoverImageDownloadUrl);
app.use(EventController.createEvent);
app.listen(port, () => {
  console.log(`Smriti running at http://localhost:${port}`);
});
