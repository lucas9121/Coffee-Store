import { sendRequest } from "./api";

const BASE_URL = `${process.env.EXPO_PUBLIC_API_URL}/menu`

export async function getMenuItems(){
  return await sendRequest(BASE_URL, "GET")
}