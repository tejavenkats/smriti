export const generateOtp = () => {
  if (process.env.NODE_ENV === "development") return "999999";
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
};
