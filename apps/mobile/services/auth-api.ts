import { sendRequest } from "./api";

const BASE_URL = `${process.env.EXPO_PUBLIC_API_URL}/users`;

type LoginPayload = {
  email: string;
  password: string;
};


export type SignupPayload = {
  name: string;
  email: string;
  password: string;
  securityQuestions: {
    question: string;
    answer: string;
  }[];
};

export async function loginUser(payload: LoginPayload) {
  return await sendRequest(`${BASE_URL}/login`, "POST", payload);
};

export async function signupUser(payload: SignupPayload) {
  return await sendRequest(`${BASE_URL}`, "POST", payload);
};

export async function logoutUser(token: string | null){
  return await sendRequest(`${BASE_URL}/me/logout`, "POST", null, token)
}