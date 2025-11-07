const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

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

const parseResponse = async <T>(response: Response): Promise<T> => {
    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
        const message = (data && (data as { message?: string }).message) || 'Request failed'
        throw new Error(message)
    }

    return data as T
}

export const signup = async (payload: SignupPayload) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })

    return parseResponse<AuthResponse>(response)
}

export const login = async (payload: LoginPayload) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })

    return parseResponse<AuthResponse>(response)
}

