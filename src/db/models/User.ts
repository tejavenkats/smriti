import { getModelForClass, prop } from "@typegoose/typegoose";

export class UserDetails {
  @prop({ required: true })
  public userId: string;

  @prop({ required: true })
  public phone: string;

  @prop({ required: true })
  public countryCode: string;

  @prop()
  public email?: string;

  @prop()
  public name?: string;
}

export enum UserNuxStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
}

export class User extends UserDetails {
  @prop()
  public mediaUploads?: string[];

  @prop()
  public nuxStatus?: UserNuxStatus;

  @prop()
  public nuxCompletionTimeStamp?: Date;
}

export const UserModel = getModelForClass(User);
