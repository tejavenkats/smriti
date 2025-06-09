import QRCode from "qrcode";

export const generateQrCode = async (text: string) => {
  const qrCode = await QRCode.toDataURL(text);
  return qrCode;
};

export const getImageBufferFromBase64 = async (base64: string) => {
  const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");
  return buffer;
};
