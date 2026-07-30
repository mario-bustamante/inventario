const authCookieKeys = [
  'accessToken',
  'userData',
  'tokenType',
  'tokenExpiresIn',
  'userAbilityRules',
]

export const clearAuthSession = () => {
  authCookieKeys.forEach(key => {
    useCookie(key).value = null
  })
}

const isLoginRequest = request => /\/login(?:\?|$)/.test(String(request || ''))

export const handleUnauthorized = request => {
  if (isLoginRequest(request))
    return

  clearAuthSession()

  if (window.location.pathname !== '/login')
    window.location.replace('/login')
}
