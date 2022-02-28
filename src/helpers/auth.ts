export function setUserData(data:UserWithToken) {
  localStorage.setItem('user', JSON.stringify(data.user))
  localStorage.setItem('token', data.token)
}

export function getToken() {
  return localStorage.token
}

export function getUser(): User|null {
  try {
    return JSON.parse(localStorage.user)
  } catch(e) {
    return null
  }
}

export function getLoggedIn() {
  return localStorage.token && localStorage.user
}