import { getToken } from "./auth";

export function get(url: string, auth: boolean = true) {

  const headers = commonHeaders(auth);

  return fetch(url, {
    method: 'GET',
    headers: headers,
    redirect: 'follow'
  })
}

export function post(url: string, data: object, auth: boolean = true) {

  const headers = commonHeaders(auth);

  var raw = JSON.stringify(data);

  return fetch(url, {
    method: 'POST',
    headers: headers,
    body: raw,
    redirect: 'follow'
  })
}

export function put(url: string, data: object, auth: boolean = true) {

  const headers = commonHeaders(auth);

  var raw = JSON.stringify(data);

  return fetch(url, {
    method: 'PUT',
    headers: headers,
    body: raw,
    redirect: 'follow'
  })
}

export function postMultipart(url: string, data: FormData, auth: boolean = true) {

  const headers = new Headers();
  
  headers.append("authorization", bearer());
  headers.append("Accept", "application/json");

  return fetch(url, {
    method: 'POST',
    headers: headers,
    body: data,
    redirect: 'follow'
  })
}

function commonHeaders(auth: boolean) {
  const headers = new Headers();
  headers.append("Accept", "application/json");
  headers.append("Content-Type", "application/json");

  if (auth) {
    headers.append("Authorization", bearer());
  }

  return headers
}

function bearer() {
  return "Bearer " + getToken()
}

export function url(path: string) {
  return import.meta.env.VITE_BASE_URL + path;
}