import { getModelForClass, prop } from "@typegoose/typegoose";
import { User } from "./User";

const x = {
  date: 1750002758000,
  description: "Shadi hogi",
  image: "cover-image-5b73b8fd-1269-4fd4-80b0-5c042cbbf439",
  location: "Hyderabad ",
  name: "Teja’s wedding",
  occasion: "Wedding",
  time: "05:20 PM - 09:20 PM",
  totalGuests: 100,
  userId: "5b73b8fd-1269-4fd4-80b0-5c042cbbf439",
};

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

export class Event extends EventRequestParams {
  @prop({ required: true })
  public eventId: string;

  @prop({ required: true })
  public qrCodeImageKey: string;

  @prop()
  public attendees?: User[];

  @prop()
  public createdOn: Date;

  @prop()
  public updatedOn: Date;

  @prop()
  public deletedOn?: Date | null;
}

export const EventModel = getModelForClass(Event);
