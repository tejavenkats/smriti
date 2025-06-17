import { getModelForClass, prop } from "@typegoose/typegoose";
import { MediaType } from "../../constants/appConstants";

export class MediaRequestParams {
  @prop({ required: true })
  userId: string;

  @prop({ required: true })
  medaiUrl: string;

  @prop({ required: true })
  mediaType: MediaType;

  @prop()
  mediaCaption?: string;

  @prop()
  metadata?: any;

  @prop()
  location?: any;
}

export class Media {
  @prop({ required: true })
  mediaId: string;
}

export const MediaModel = getModelForClass(Media);
