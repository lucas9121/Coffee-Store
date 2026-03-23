

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
