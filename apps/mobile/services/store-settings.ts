import { sendRequest } from "./api";

const BASE_URL = `${process.env.EXPO_PUBLIC_API_URL}/store/status`

export async function getStoreStatus(){
  return await sendRequest(BASE_URL)
}