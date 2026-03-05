import * as SecureStore from "expo-secure-store";
const REFRESH_TOKEN_KEY = "refreshToken"

export async function getRefreshToken(): Promise<string | null> {
  const token = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  return token;
};

export async function setRefreshToken(token:string): Promise<void> {
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
};

export async function deleteRefreshToken(): Promise<void> {
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
};