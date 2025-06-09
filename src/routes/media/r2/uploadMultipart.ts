import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from "fs";
export const uploadFile = async (
  files: any,
  filename: string,
  headers: any
) => {
  //   const parallelUploads3 = new Upload({
  //     client: new S3Client({
  //       region: "apac",
  //       endpoint:
  //         "https://bc79f5645827330fb0ab661f672ceb73.r2.cloudflarestorage.com",
  //       credentials: {
  //         accessKeyId: "7d255c7abca29e3674b52fbc099e6a6a",
  //         secretAccessKey:
  //           "5f9bf8d5a0f9ccf6205f77db03bdb577eed168b0a8d47cde7e0db2ca850e24cf",
  //       },
  //     }),
  //     params: {
  //       Bucket: "test",
  //       Key: `test123/${filename}`,
  //       Body: file,
  //     },
  //   });

  //   parallelUploads3.on("httpUploadProgress", (progress) => {
  //     console.log(progress);
  //   });

  //   await parallelUploads3.done();

  const s3Client = new S3Client({
    region: "apac",
    endpoint:
      "https://bc79f5645827330fb0ab661f672ceb73.r2.cloudflarestorage.com",
    credentials: {
      accessKeyId: "7d255c7abca29e3674b52fbc099e6a6a",
      secretAccessKey:
        "5f9bf8d5a0f9ccf6205f77db03bdb577eed168b0a8d47cde7e0db2ca850e24cf",
    },
  });

  //   // Example of putting an object
  const putObjectCommand = new PutObjectCommand({
    Bucket: "test",
    Key: `test123/${filename}`,
  });

  const getObjectCommand = new GetObjectCommand({
    Bucket: "test",
    Key: `test123/${filename}`,
  });

  const presignedUrl = await getSignedUrl(s3Client, putObjectCommand, {
    expiresIn: 3600,
  });

  //   console.log("contentLength", headers);
  const fileData = fs.createReadStream(files.filepath);

  // const res = await fetch(presignedUrl, {
  //   method: "PUT",
  //   body: fileData as any,
  //   headers: {
  //     "content-type": files[0].mimetype,
  //     "content-length": headers["content-length"],
  //   },
  // });
  const res = await fetch(presignedUrl, {
    method: "PUT",
    body: fileData as any,
    headers: {
      "content-type": files.mimetype,
      "content-length": headers["content-length"],
    },
  });

  return presignedUrl;
};
