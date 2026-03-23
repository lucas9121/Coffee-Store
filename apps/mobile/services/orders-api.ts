import { sendRequest } from "./api";

const BASE_URL = `${process.env.EXPO_PUBLIC_API_URL}/orders`

export async function createOrder(payload:{
  customerName: string;
  orderItems: { item: string; quantity: number}[];
}){
    return await sendRequest(BASE_URL, "POST", payload)
}