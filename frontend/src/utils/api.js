import { ofetch } from 'ofetch'
import { handleUnauthorized } from '@/utils/auth-session'

export const $api = ofetch.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  async onRequest({ options }) {
    const accessToken = useCookie('accessToken').value
    if (accessToken) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      }
    }
  },
  async onResponseError({ request, response }) {
    if (response?.status === 401)
      handleUnauthorized(request)
  },
})
