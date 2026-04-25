import { sendRequest } from "./api";

const BASE_URL = `${process.env.EXPO_PUBLIC_API_URL}/users/me`;

export async function getCurrentUser(token: string | null){
  return await sendRequest(BASE_URL, "GET", null, token)
};

export async function updateUserProfile(
  payload: {
    name?: string;
    email?: string;
    password: string;
  },
  token: string | null
) {
  return await sendRequest(`${BASE_URL}/profile`, "PATCH", payload, token)
}