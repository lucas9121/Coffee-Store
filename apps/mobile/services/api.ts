export class RequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "RequestError";
    this.status = status;
  }
}

export async function sendRequest(
  url: string,
  method: string = 'GET',
  payload: object | null = null,
  token: string | null = null
) {
  const options: RequestInit = { method };

  if (payload) {
    options.headers = { 'Content-Type': 'application/json' };
    options.body = JSON.stringify(payload);
  }

  if (token) {
    options.headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    };
  }

  try {
    const res = await fetch(url, options);

    if (res.ok) {
      if (res.status === 204) {
        return null;
      }
      const text = await res.text();
      return text ? JSON.parse(text) : null;
    } else {
      const text = await res.text();
      const errorResponse = text ? JSON.parse(text) : null;
      console.error('Error Response:', errorResponse);
      throw new RequestError(`Request failed with status ${res.status}`, res.status);
    }
  } catch (error) {
    if(error instanceof RequestError) throw error;
    console.error('Request Error ', error);
    throw new Error('Request failed. Please check your network connection and try again.');
  }
};
