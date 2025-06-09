import { getModelForClass, prop } from "@typegoose/typegoose";
import { UserSchema } from "./User";

export class EventRequestParams {
  @prop({ required: true })
  public name: string;

  @prop({ required: true })
  public occasion: string;

  @prop({ required: true })
  public description: string;

  @prop({ required: true })
  public totalGuests: number;

  @prop({ required: true })
  public location: string;

  @prop({ required: true })
  public date: Date;

  @prop({ required: true })
  public time: string;

  @prop({ required: true })
  public userId: string;

  @prop()
  public image?: string;

  @prop()
  public metadata?: any;
}

export class EventSchema extends EventRequestParams {
  @prop({ required: true })
  public eventId: string;

  @prop({ required: true })
  public qrCodeImageKey: string;

  @prop()
  public attendees?: UserSchema[];
}

export const EventModel = getModelForClass(EventSchema);
