const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3002";

export async function loginAdmin(email, password) {
  const response = await fetch(`${API_URL}/users/login`, {
    method: 'POSt',
    header: {"Content-Type": "application/json"},
    body: JSON.stringify({
      email, 
      password
    }),
  });

  const data = await response.json();

  if(!response.ok) {
    throw new Error(data.message ?? "Unable to log in");
  }
  if(data.user?.account !== "admin") {
    throw new Error("Invalid account")
  }

  return data;
};