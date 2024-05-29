/** @format */

import { ApiResponse } from "apisauce";
import { api } from "./httpClient";

const BASE_URL: string = "https://style-protocol-mvp-admin.herokuapp.com/api";
const authToken: string =
  (typeof window !== "undefined" ? localStorage.getItem("authToken") : "") ||
  "";

export const addOrder = async (
  body: {
    nft: string;
    payment: number;
    customAsset: string;
    paymentHash: string;
    chain: string;
    connector: string;
    world: string;
    grToken: string;
    referral_code?: string;
    orderPlatform: string;
  },
  token: any
): Promise<ApiResponse<any>> => {
  try {
    console.log("body", body);
    const response = await api(BASE_URL, authToken || token).post(
      "/orders",
      body
    );
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const logNEOActivity = async (
  body: {
    action: string;
    mediaOrUrl?: string;
    platform?: string;
  },
  token: any
): Promise<ApiResponse<any>> => {
  try {
    const response = await api(BASE_URL, authToken || token).post(
      "/activities/whitelabels",
      body
    );
    console.log("neoTokyo res", response);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const logGptActivity = async (
  body: {
    action: string;
    mediaOrUrl: string;
    prompt?: string;
  },
  token: any
): Promise<ApiResponse<any>> => {
  try {
    const response = await api(BASE_URL, authToken || token).post(
      "/activities/gpt",
      body
    );
    console.log("gpt res", response);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getOrders = async (
  id: string | number,
  token: any
): Promise<ApiResponse<any>> => {
  try {
    const response = await api(BASE_URL, authToken || token).get(
      `/orders/user/${id}`
    );
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
