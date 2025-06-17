import { isEmpty } from "lodash";
import { OtpModel, Otp } from "../../db/models/Otp";
import { UserModel } from "../../db/models/User";
import { v4 as uuidv4 } from "uuid";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/tokenUtils";

export const verifyOtp = async (
  phone: string,
  countryCode: string,
  otp: string,
  requestId: string
) => {
  console.log("query: ", {
    phoneNumber: phone,
    countryCode: countryCode,
    otp: otp,
    requestId: requestId,
  });

  const matchingOtpRow: Otp | null = await OtpModel.findOne({
    phoneNumber: phone,
    countryCode: countryCode,
    otp: otp,
    requestId: requestId,
  });
  if (isEmpty(matchingOtpRow)) {
    throw new Error("Otp not found");
  }
  const isOtpExpired = matchingOtpRow.expiresAt < new Date();
  if (isOtpExpired) {
    throw new Error("Otp expired");
  }

  //generate access and refresh tokens with user data
  const userDataForSigning = {
    userId: uuidv4(),
  };

  const rt = generateRefreshToken(userDataForSigning);
  const at = generateAccessToken(userDataForSigning);

  const newUser = new UserModel({
    ...userDataForSigning,
    phone: phone,
    countryCode: countryCode,
  });

  const registeredUser = await newUser.save();
  return {
    userData: {
      userId: registeredUser.userId,
      phone: registeredUser.phone,
      countryCode: registeredUser.countryCode,
    },
    at: at,
    rt: rt,
  };
};
