import type { User } from '../entities/User'

export interface AuthResponse {
    user: User
    accessToken: string
    tokenType: string
}