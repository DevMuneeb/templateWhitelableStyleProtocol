// @ts-nocheck
import axios from "axios";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.NEXT_AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_AWS_S3_SECRET_ACCESS_KEY,
  },
});

async function uploadFileToS3(file: Buffer, fileName: any, contentType: any) {
  const fileString = `${
    process.env.NEXT_AWS_S3_PREFIX
  }/public/two_d_gpt/tdg_${Date.now()}_${fileName}`;

  const params = {
    Bucket: process.env.NEXT_AWS_S3_BUCKET_NAME,
    Key: fileString,
    Body: file,
    ContentType: contentType,
  };

  const command = new PutObjectCommand(params);
  try {
    const response = await s3Client.send(command);
    return `${process.env.NEXT_AWS_S3_DOMAIN}${fileString}`;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const { base64 } = await request.json();

    const contentType = "image/png";
    // Decode base64 image data to binary
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const uploadedFileUrl = await uploadFileToS3(
      buffer,
      `td-${Date.now().toString(32)}.png`,
      contentType
    );

    return Response.json({
      url: uploadedFileUrl,
    });
  } catch (error) {
    console.error("Error fetching and uploading 2D:", error);
    return Response.error({
      message: error,
    });
  }
}
