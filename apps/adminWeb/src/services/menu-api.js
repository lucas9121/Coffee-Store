import { apiFetch } from "./api";

export async function getMenuItems() {
  return await apiFetch("/menu");
}

export async function createMenuItem(item) {
  return await apiFetch("/menu", {
    method: "POST",
    body: JSON.stringify(item),
  });
}

export async function updateMenuItem(id, item) {
  return await apiFetch(`/menu/${id}`, {
    method: "PATCH",
    body: JSON.stringify(item),
  });
}

export async function deleteMenuItem(id) {
  return await apiFetch(`/menu/${id}`, {
    method: "DELETE",
  });
}