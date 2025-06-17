import { getModelForClass, prop } from "@typegoose/typegoose";
import { AttendeeRoles } from "../../constants/appConstants";

export class AttendeeRequestParams {
  @prop({ required: true })
  public eventId: string;

  @prop({ required: true })
  public name: string;

  @prop({ required: true })
  public role: AttendeeRoles;

  @prop({ required: true })
  public userId: string;

  @prop()
  public entryTime?: Date;

  @prop()
  public exitTime?: Date;

  @prop()
  public metadata?: any;

  @prop()
  public location?: string;
}

export class Attendee extends AttendeeRequestParams {
  @prop({ required: true })
  attendeeId: string;
}

export const AttendeeModel = getModelForClass(Attendee);
