import { useAuth } from "@/context/AuthContext";

export async function sendRequest(
  url: string,
  method: string = 'GET',
  payload: object | null = null
) {
  const options: RequestInit = { method };
  const { accessToken } = useAuth();

  if (payload) {
    options.headers = { 'Content-Type': 'application/json' };
    options.body = JSON.stringify(payload);
  }

  if (accessToken) {
    options.headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${accessToken}`,
    };
  }

  try {
    const res = await fetch(url, options);

    if (res.ok) {
      return res.json();
    } else {
      const errorResponse = await res.json();
      console.error('Error Response:', errorResponse);
      throw new Error(`Request failed with status ${res.status}`);
    }
  } catch (error) {
    console.error('Request Error ', error);
    throw new Error('Request failed. Please check your network connection and try again.');
  }
};
