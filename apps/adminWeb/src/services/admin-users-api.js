import { apiFetch } from "./api";

export async function getAdminUsers(
  page = 1,
  sortBy = "createdAt",
  sortDir = "desc"
) {
  return apiFetch(`/admin/users?page=${page}&sortBy=${sortBy}&sortDir=${sortDir}`);
}

export async function updateUserAccount(userId, account){
  return await apiFetch(`/admin/users/${userId}/account`, {
    method: "PATCH",
    body: JSON.stringify({ account })
  });
}