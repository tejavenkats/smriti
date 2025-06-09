import { isEmpty } from "lodash";
import { triggerFast2SmsOtp } from "./fast2sms";
import { generateOtp } from "./otpUtils";
import { OtpModel } from "../../db/models/Otp";
import { OTP_EXPIRATION_DURATION } from "../../constants/appConstants";
import { v4 as uuidv4 } from "uuid";

export const requestOtp = async (phone: string, countryCode: string) => {
  console.log("env: ", process.env.NODE_ENV);
  const otp = generateOtp();
  const isDevEnv = process.env.NODE_ENV === "development";
  try {
    if (isDevEnv) {
      const otpData = new OtpModel({
        phoneNumber: phone,
        countryCode: countryCode,
        otp: otp,
        expiresAt: new Date(Date.now() + OTP_EXPIRATION_DURATION),
        requestId: uuidv4(),
      });
      const otpDbSaveRes = await otpData.save();
      return otpDbSaveRes;
    }
    const otpRes: any = await triggerFast2SmsOtp(phone, otp);
    const otpData = new OtpModel({
      phoneNumber: phone,
      countryCode: countryCode,
      otp: otp,
      expiresAt: new Date(Date.now() + OTP_EXPIRATION_DURATION),
      requestId: otpRes.data.request_id,
    });
    const otpDbSaveRes = await otpData.save();
    return otpDbSaveRes;
  } catch (error) {
    console.error("error requesting otp", error);
  }
};
