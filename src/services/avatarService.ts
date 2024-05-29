/** @format */

import { ApiResponse, create } from "apisauce";
import { File } from "buffer";

const BASE_URL: string =
  "https://api.stability.ai/v2beta/stable-image/generate";
const authToken: string = "sk-nUNXZplzfLVShtgidvIuJm1OuSCdeYF0Fd5pwfhDjmkmTisQ";
const meshyApiKey: string = "msy_Xnygi2E0SzrkfxDrKfXfAXVfxp12oC84WN8b";
const imgbbApiKey: string = "6d58af3cc9f2c424704d9c3faf93e12c";

const api = create({
  baseURL: "https://api.stability.ai/v2beta/stable-image/generate",
  headers: {
    Accept: "image/*",
  },
  responseType: "arraybuffer",
});

const meshyApi = create({
  baseURL: "https://api.meshy.ai/v1",
  headers: {
    Authorization: `Bearer ${meshyApiKey}`,
  },
});

const imgbbApi = create({
  baseURL: "https://api.imgbb.com/1",
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export const generateAvatar = async (credentials: {
  prompt: string;
}): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post(
      "/core",
      {
        prompt: `${credentials.prompt} character full body`,
        output_format: "jpeg",
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error Generate Avatar:", error);
    throw error;
  }
};

export const create3DAvatar = async (credentials: {
  image_url: string;
}): Promise<ApiResponse<any>> => {
  try {
    const response: ApiResponse<any> = await meshyApi.post("/image-to-3d", {
      image_url: credentials.image_url,
    });
    console.log("Create 3D Avatar Response:", response.data);
    const task_id = response?.data?.result;
    if (!task_id) {
      throw new Error("Task ID not found");
    }
    return response;
  } catch (error) {
    console.error("Error Generate Avatar:", error);
    throw error;
  }
};

export const get3DAvatar = async (credentials: {
  task_id: string;
}): Promise<ApiResponse<any>> => {
  try {
    const response: ApiResponse<any> = await meshyApi.get(
      `/image-to-3d/${credentials.task_id}`
    );
    return response;
  } catch (error) {
    console.error("Error Get 3D Avatar:", error);
    throw error;
  }
};

export const getImageUrl = async ({
  image,
}: {
  image: string;
}): Promise<ApiResponse<any>> => {
  const myForm = new FormData();
  myForm.append("image", image);
  try {
    const response = await imgbbApi.post(
      `/upload?expiration=60&key=${imgbbApiKey}`,
      myForm
    );
    return response;
  } catch (error) {
    console.error("Error Get Image URL:", error);
    throw error;
  }
};

export const pinModelToS3 = async (
  modelUrl: string
): Promise<ApiResponse<any>> => {
  const api = create({ baseURL: "/api" });
  try {
    const response = await api.post("/pin-model", {
      modelUrl,
    });
    console.log("Pin Model To S3 Response:", response);
    return response;
  } catch (error) {
    console.error("Error Pin Model To S3:", error);
    throw error;
  }
};

export const pin2DToS3 = async (base64: any): Promise<ApiResponse<any>> => {
  const api = create({ baseURL: "/api" });
  try {
    const response = await api.post("/upload-avatar", {
      base64,
    });
    console.log("Pin 2D To S3 Response:", response);
    return response;
  } catch (error) {
    console.error("Error Pin 2D To S3:", error);
    throw error;
  }
};
