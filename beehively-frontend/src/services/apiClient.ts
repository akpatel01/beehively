import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

const getStoredToken = () => sessionStorage.getItem('token') || localStorage.getItem('token')

apiClient.interceptors.request.use((config) => {
    const token = getStoredToken()
    if (token) {
        config.headers = config.headers ?? {}
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export const extractAxiosErrorMessage = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        const message =
            (error.response?.data as { message?: string } | undefined)?.message ||
            error.message ||
            'Request failed'
        return message
    }

    if (error instanceof Error) {
        return error.message
    }

    return 'Request failed'
}

export default apiClient


