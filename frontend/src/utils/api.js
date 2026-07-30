import { ofetch } from 'ofetch'
import { handleUnauthorized } from '@/utils/auth-session'

const apiBaseURL = import.meta.env.VITE_API_BASE_URL || '/api'
const refreshRoute = /\/refresh(?:\?|$)/
const logoutRoute = /\/logout(?:\?|$)/
const publicAuthRoutes = /\/(login|register)(?:\?|$)/

const apiClient = ofetch.create({
  baseURL: apiBaseURL,
  credentials: 'include',
  retry: 0,
})

let refreshPromise = null

const getRequestUrl = request => {
  if (typeof request === 'string')
    return request

  if (request instanceof Request)
    return request.url

  return String(request || '')
}

const shouldSkipRefresh = requestUrl => {
  return publicAuthRoutes.test(requestUrl)
    || refreshRoute.test(requestUrl)
    || logoutRoute.test(requestUrl)
}

const shouldHandleUnauthorized = requestUrl => {
  return !publicAuthRoutes.test(requestUrl) && !logoutRoute.test(requestUrl)
}

const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = apiClient('/refresh', { method: 'POST' })
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

export const $api = async (request, options = {}) => {
  const { _retried = false, ...fetchOptions } = options
  const requestUrl = getRequestUrl(request)

  try {
    return await apiClient(request, fetchOptions)
  } catch (error) {
    const status = error?.response?.status

    if (status === 401 && !_retried && !shouldSkipRefresh(requestUrl)) {
      try {
        const refreshResp = await refreshAccessToken()

        if (refreshResp?.user)
          useCookie('userData', { sameSite: 'lax' }).value = refreshResp.user

        if (refreshResp?.expires_in)
          useCookie('tokenExpiresIn', { sameSite: 'lax' }).value = refreshResp.expires_in

        if (refreshResp?.token_type)
          useCookie('tokenType', { sameSite: 'lax' }).value = refreshResp.token_type

        return await $api(request, { ...fetchOptions, _retried: true })
      } catch {
        handleUnauthorized(requestUrl)
      }
    } else if (status === 401 && shouldHandleUnauthorized(requestUrl)) {
      handleUnauthorized(requestUrl)
    }

    throw error
  }
}
