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
};

export async function updateUserPassword(
  payload: {
    currentPassword: string;
    newPassword: string;
  },
  token: string | null
) {
  return await sendRequest(`${BASE_URL}/password`, "PATCH", payload, token)
};

export async function updateUserSecurityQuestion(
  payload: {
    password: string;
    index: number;
    newQuestion: string;
    newAnswer: string;
  },
  token: string | null
) {
  return await sendRequest(`${BASE_URL}/security-question`, "PATCH", payload, token)
};

export async function toggleFavoriteItem(
  itemId: string,
  token: string | null
) {
  return await sendRequest(`${BASE_URL}/favorites/${itemId}`, "PATCH", null, token);
};

export async function deleteUser(
  payload: { password: string },
  token: string | null
) {
  return await sendRequest(BASE_URL, "DELETE", payload, token)
}