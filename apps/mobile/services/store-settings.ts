import { sendRequest } from "./api";

const BASE_URL = `${process.env.EXPO_PUBLIC_API_URL}/store`

export async function getStoreStatus(){
  return await sendRequest(`${BASE_URL}/status`)
}

export async function setStoreOverride(
  payload: {status: string | null; expiresAt: string | null},
  token: string | null
) {
  return await sendRequest(`${BASE_URL}/override`, "PATCH", payload, token);
}

export async function getStoreHours(){
  return await sendRequest(BASE_URL)
}