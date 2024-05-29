/** @format */

import { ApiResponse } from "apisauce";
import { api } from "./httpClient";

const BASE_URL: string = "https://style-protocol-mvp-admin.herokuapp.com/api";
const authToken: string =
  (typeof window !== "undefined" ? localStorage.getItem("authToken") : "") ||
  "";

export const authenticate = async (
  credentials: any
): Promise<ApiResponse<any>> => {
  try {
    const response = await api(BASE_URL, authToken).post("/auth", credentials);
    return response;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};
