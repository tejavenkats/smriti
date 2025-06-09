import {
  GetObjectCommand,
  PutObjectAclCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
  S3ClientConfig,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
export const s3Client = new S3Client({
  region: process.env.R2_REGION,
  endpoint: process.env.R2_BUCKET_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_CLIENT_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_CLIENT_SECRET_ACCESS_KEY,
  },
} as S3ClientConfig);

export const getr2SignedUrl = async (
  bucketName: string,
  fileName: string,
  action: "put" | "get" = "put",
  expiry: number = 3600,
  contentType?: string
) => {
  const params: PutObjectCommandInput = {
    Bucket: bucketName,
    Key: fileName,
  };
  if (contentType) {
    params.ContentType = contentType;
  }
  const putObjectCommand = new PutObjectCommand(params);
  const getObjectCommand = new GetObjectCommand({
    Bucket: bucketName,
    Key: fileName,
  });
  const presignedUrl = await getSignedUrl(
    s3Client,
    action === "get" ? getObjectCommand : putObjectCommand,
    {
      expiresIn: expiry,
    }
  );
  return presignedUrl;
};

export const getEventQrCodeAssetKey = (eventId: string) => {
  return "event-" + eventId + ".png";
};

export const getUserMediaAssetKey = (userId: string) => {
  const id = uuidv4();
  return `${userId}-${id}`;
};
