import { Event, EventModel, EventRequestParams } from "../../db/models/Event";
import { v4 as uuidv4 } from "uuid";
import { generateQrCode, getImageBufferFromBase64 } from "../../utils/qrUtils";
import {
  getEventQrCodeAssetKey,
  getr2SignedUrl,
} from "../../utils/fileUploadUtils";
import { putRequest } from "../../utils/requestUtils";
export const createEvent = async (eventDetails: EventRequestParams) => {
  const eventId = uuidv4();

  const qrCodeData = {
    ...eventDetails,
  };

  const qrCode = await generateQrCode(JSON.stringify(qrCodeData));

  const qrImageBuffer = await getImageBufferFromBase64(qrCode);

  const eventQrAssetKey = getEventQrCodeAssetKey(eventId);
  const signedUrl = await getr2SignedUrl("events", eventQrAssetKey);

  console.log("Signed URL: ", signedUrl);

  await putRequest(signedUrl, qrImageBuffer, {
    "Content-Type": "image/png",
    "Content-Length": qrImageBuffer.length,
  });

  console.log("eventData model: ", eventDetails);

  const eventData: Event = {
    ...eventDetails,
    eventId: eventId,
    qrCodeImageKey: eventQrAssetKey,
    createdOn: new Date(),
    updatedOn: new Date(),
    deletedOn: null,
  };

  console.log("eventData model: ", eventData);

  const event = new EventModel({ ...eventData });
  return await event.save();
};
