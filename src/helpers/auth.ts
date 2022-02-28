export function setUserData(data:UserWithToken) {
  localStorage.setItem('user', JSON.stringify(data.user))
  localStorage.setItem('token', data.token)
}

export function token() {
  return localStorage.token
}

export function user() {
  try {
    return JSON.parse(localStorage.user)
  } catch (error) {
    return null
  }
}

export function isLoggedIn() {
  return localStorage.token && localStorage.user
}