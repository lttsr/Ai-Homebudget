import axios from "axios";
import { VITE_APP_API_ROOT } from "./env";

export const apiRoot = axios.create({
  baseURL: VITE_APP_API_ROOT,
});

export const get = async <T>(url: string): Promise<T> => {
  const response = await apiRoot.get<T>(url);
  console.log(response.data);
  return response.data;
};

export const post = async <T>(url: string, data: unknown): Promise<T> => {
  const response = await apiRoot.post(url, data);
  console.log(response.data);
  return response.data;
};
