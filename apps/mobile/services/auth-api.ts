import { sendRequest } from "./api";

const BASE_URL = `${process.env.EXPO_PUBLIC_API_URL}/users`;

type LoginPayload = {
  email: string;
  password: string;
};

export async function loginUser(payload: LoginPayload) {
  return await sendRequest(`${BASE_URL}/login`, "POST", payload);
}