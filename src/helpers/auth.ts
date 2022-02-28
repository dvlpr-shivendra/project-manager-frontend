export function setUserData(data:UserWithToken) {
  localStorage.setItem('user', JSON.stringify(data.user))
  localStorage.setItem('token', data.token)
}

export function getToken() {
  return localStorage.token
}

export function getUser(): User {
  return JSON.parse(localStorage.user)
}

export function getLoggedIn() {
  return localStorage.token && localStorage.user
}