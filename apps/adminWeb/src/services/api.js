const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3002";

export async function apiFetch(path, options = {}) {
  const token = sessionStorage.getItem("adminToken");

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const data = response.status === 204
    ? null
    : await response.json();

  if (!response.ok) {
    throw new Error(data?.message ?? "Something went wrong");
  }

  return data;
}