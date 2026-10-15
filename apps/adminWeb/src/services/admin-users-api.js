import { apiFetch } from "./api";

export async function getAdminUsers() {
  return apiFetch("/admin/users");
}

export async function updateUserAccount(userId, account){
  return await apiFetch(`/admin/users/${userId}/account`, {
    method: "PATCH",
    body: JSON.stringify({ account })
  });
}