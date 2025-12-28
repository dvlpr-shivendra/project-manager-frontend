import { getToken } from "./auth";

async function request(
  url: string,
  options: RequestInit,
  expectBlob = false,
) {
  const res = await fetch(url, options);

  if (res.status === 204) return;

  if (!res.ok) {
    const text = await res.text();
    throw text ? JSON.parse(text) : res.statusText;
  }

  return expectBlob ? res.blob() : res.json();
}

function commonHeaders(auth: boolean, json = true) {
  const headers = new Headers();
  headers.append("Accept", "application/json");

  if (json) headers.append("Content-Type", "application/json");
  if (auth) headers.append("Authorization", bearer());

  return headers;
}

function bearer() {
  return "Bearer " + getToken();
}

/* ===== Public API ===== */

export async function get(url: string, auth = true) {
  return request(url, {
    method: "GET",
    headers: commonHeaders(auth),
    redirect: "follow",
  });
}

export async function post(url: string, data: object = {}, auth = true) {
  return request(url, {
    method: "POST",
    headers: commonHeaders(auth),
    body: JSON.stringify(data),
    redirect: "follow",
  });
}

export async function put(url: string, data: object, auth = true) {
  return request(url, {
    method: "PUT",
    headers: commonHeaders(auth),
    body: JSON.stringify(data),
    redirect: "follow",
  });
}

export async function destroy(
  url: string,
  data: object | undefined = undefined,
  auth = true,
) {
  return request(url, {
    method: "DELETE",
    headers: commonHeaders(auth),
    body: data ? JSON.stringify(data) : undefined,
    redirect: "follow",
  });
}

export async function postMultipart(
  url: string,
  data: FormData,
  auth = true,
) {
  return request(url, {
    method: "POST",
    headers: commonHeaders(auth, false),
    body: data,
    redirect: "follow",
  });
}

export async function getBlob(url: string, auth = true) {
  return request(
    url,
    { method: "GET", headers: commonHeaders(auth) },
    true,
  );
}

export function url(path: string) {
  return import.meta.env.VITE_BASE_URL + path;
}
