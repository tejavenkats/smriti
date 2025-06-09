import {
  AttendeeModel,
  AttendeeRequestParams,
  AttendeeSchema,
} from "../../db/models/Attendee";
import { v4 as uuidv4 } from "uuid";

export const registerAttendee = async (
  attendeeDetails: AttendeeRequestParams
) => {
  const attendeeDataWithId: AttendeeSchema = {
    ...attendeeDetails,
    attendeeId: uuidv4(),
  };

  const newAttendee = new AttendeeModel({ ...attendeeDataWithId });
  return await newAttendee.save();
};
