import apiClient, { extractAxiosErrorMessage } from './apiClient'

type SignupPayload = {
    name: string
    email: string
    password: string
}

type LoginPayload = {
    email: string
    password: string
}

type AuthResponse = {
    message: string
    token: string
    user?: {
        id: string
        name: string
        email: string
    }
}
export const signup = async (payload: SignupPayload) => {
    try {
        const { data } = await apiClient.post<AuthResponse>('/auth/signup', payload)
        return data
    } catch (error) {
        throw new Error(extractAxiosErrorMessage(error))
    }
}

export const login = async (payload: LoginPayload) => {
    try {
        const { data } = await apiClient.post<AuthResponse>('/auth/login', payload)
        return data
    } catch (error) {
        throw new Error(extractAxiosErrorMessage(error))
    }
}
