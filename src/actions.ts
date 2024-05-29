// @ts-nocheck
"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import sharp from "sharp";

const s3Client = new S3Client({
  region: process.env.NEXT_AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_AWS_S3_SECRET_ACCESS_KEY,
  },
});

export async function createIsAuthenticatedCookie(data: string) {
  cookies().set({
    name: "accessToken",
    value: data,
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });
}

export async function createCookie(name: string, data: string) {
  cookies().set({
    name: name,
    value: data,
    httpOnly: true,
    sameSite: "strict",
  });
}

export async function deleteCookie(data: string) {
  cookies().delete(data);
}

export async function navigate(route: string) {
  redirect(`${route}`);
}

export async function uploadFileToS3(file: Buffer, fileName: any) {
  // const fileBuffer = await sharp(file)
  //   .jpeg({ quality: 50 })
  //   .resize(800, 400)
  //   .toBuffer();

  const fileString = `${
    process.env.NEXT_AWS_S3_PREFIX
  }/public/custom_assets/neotokyo_ca_${Date.now()}_${fileName}`;

  const params = {
    Bucket: process.env.NEXT_AWS_S3_BUCKET_NAME,
    Key: fileString,
    Body: file,
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

export async function uploadFile(formData: { get: (arg0: string) => any }) {
  try {
    const file = formData.get("customAsset");

    if (file.size === 0) {
      return { status: "error", message: "Please select a file." };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileUrl = await uploadFileToS3(
      buffer,
      `custom-${Date.now().toString(32)}.png`
    );

    return { status: "success", message: fileUrl };
  } catch (error) {
    return { status: "error", message: "Failed to upload file." };
  }
}
