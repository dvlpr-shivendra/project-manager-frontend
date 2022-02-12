export function get(url: string, auth: boolean = true) {

  const headers = commonHeaders(auth);

  return fetch(url, {
    method: 'GET',
    headers: headers,
    redirect: 'follow'
  })
}

function commonHeaders(auth: boolean) {
  const headers = new Headers();
  headers.append("Accept", "application/json");

  if (auth) {
    headers.append("Authorization", bearer());
  }

  return headers
}

function bearer() {
  return "Bearer " + localStorage.getItem('token')
}

export function url(path: string) {
  return import.meta.env.VITE_BASE_URL + path;
}