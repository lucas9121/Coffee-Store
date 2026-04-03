import { sendRequest } from "./api";

const BASE_URL = `${process.env.EXPO_PUBLIC_API_URL}/orders`

export async function createOrder(
  payload:{
    customerName: string;
    orderItems: { item: string; quantity: number}[];
  }, 
  token: string | null
) {
    return await sendRequest(BASE_URL, "POST", payload, token)
}

export async function getAllOrders(token: string | null){
  return await sendRequest(BASE_URL, "GET", null, token)
}

export async function getOrderById(id: string){
  return await sendRequest(`${BASE_URL}/${id}`, "GET")
}

export async function updateOrderStatus(
  id: string,
  status: string,
  token: string | null
) {
  return await sendRequest(`${BASE_URL}/${id}/status`, "PATCH", {status}, token);
}