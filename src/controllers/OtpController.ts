import { isEmpty } from "lodash";
import { expressRouter } from "../expressApp";
import { requestOtp } from "../routes/otp/requestOtp";
import { verifyOtp } from "../routes/otp/verifyOtp";

export const OtpController = {
  requestOtp: expressRouter.post("/request-otp", async (req, res) => {
    const { phone, countryCode } = req.body;

    if (!phone || !countryCode) {
      console.error("phone and countryCode are required", req.body);

      return res.status(400).send({
        success: false,
        message: "phone and countryCode are required",
      });
    }
    const otpRes = await requestOtp(phone, countryCode);
    if (isEmpty(otpRes)) {
      return res.status(500).send({
        success: false,
        message: "Failed to send otp",
      });
    }
    res.status(200).send({
      success: true,
      message: "Otp sent successfully",
      otpRequestId: otpRes.requestId,
    });
  }),

  verifyOtp: expressRouter.post("/verify-otp", async (req, res) => {
    const { phone, countryCode, otp, requestId } = req.body;

    if (!phone || !countryCode || !otp || !requestId) {
      return res.status(400).send({
        success: false,
        message: "phone, countryCode, otp, requestId are required",
      });
    }

    const verificationRes = await verifyOtp(phone, countryCode, otp, requestId);

    if (isEmpty(verificationRes) || isEmpty(verificationRes.userData)) {
      return res.status(500).send({
        success: false,
        message: "Failed to verify otp",
      });
    }
    console.log("verificationRes: ", verificationRes);

    return res.status(200).send({
      success: true,
      message: "Otp verified successfully",
      ...verificationRes,
    });
  }),
};
