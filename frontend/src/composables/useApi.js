import { createFetch } from '@vueuse/core'
import { destr } from 'destr'
import { handleUnauthorized } from '@/utils/auth-session'

export const useApi = createFetch({
  baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  fetchOptions: {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  },
  options: {
    refetch: true,
    afterFetch(ctx) {
      const { data, response } = ctx

      // Parse data if it's JSON
      let parsedData = null
      try {
        parsedData = destr(data)
      }
      catch (error) {
        console.error(error)
      }
      
      return { data: parsedData, response }
    },
    onFetchError(ctx) {
      if (ctx.response?.status === 401)
        handleUnauthorized(ctx.response?.url || '')

      return ctx
    },
  },
})
