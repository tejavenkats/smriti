import { REQUEST_FAST2SMS_OTP } from "../../constants/requestUrls";
import { postRequest } from "../../utils/requestUtils";

export const triggerFast2SmsOtp = async (phoneNumber: string, otp: string) => {
  const requestOtpRes = await postRequest(
    REQUEST_FAST2SMS_OTP,
    {
      variables_values: otp,
      route: "otp",
      numbers: phoneNumber,
    },
    {
      authorization: process.env.FAST2SMS_OTP_API_KEY,
      "Content-Type": "application/json",
    }
  );
  return requestOtpRes;
};
