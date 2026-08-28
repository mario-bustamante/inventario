import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean
}

const authEndpoints = [
    '/auth/login',
    '/auth/register',
    '/auth/refresh',
    '/auth/logout'
]

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

const refreshApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
        'Accept': 'application/json'
    }
})

let refreshRequest: Promise<void> | null = null

function shouldRefresh(config: RetriableRequestConfig): boolean {
    return !config._retry && !authEndpoints.includes(config.url ?? '')
}

api.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
        const request = error.config as RetriableRequestConfig | undefined

        if (error.response?.status !== 401 || !request || !shouldRefresh(request)) {
            return Promise.reject(error)
        }

        request._retry = true

        try {
            refreshRequest ??= refreshApi
                .post('/auth/refresh')
                .then(() => undefined)
                .finally(() => {
                    refreshRequest = null
                })

            await refreshRequest

            return api(request)

        } catch (refreshError) {
            return Promise.reject(refreshError)
        }
    }
)

export default api