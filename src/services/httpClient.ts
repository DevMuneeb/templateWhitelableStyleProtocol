/** @format */

import { create } from "apisauce";

// Create an instance of apisauce

export const api = (baseURL: string, authToken: string) => {
  const api = create({
    baseURL: baseURL,
  });
  api.addAsyncRequestTransform(async (request: any) => {
    if (!authToken) return;

    if (request.headers) {
      request.headers["Authorization"] = `Bearer ${authToken}`;
    }
  });

  return api;
};
