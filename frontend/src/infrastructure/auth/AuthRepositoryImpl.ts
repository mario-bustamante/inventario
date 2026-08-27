import api from '@/shared/http/api'

import type { AuthRepository } from '@/domain/auth/repositories/AuthRepository'
import type { LoginCredentials } from '@/domain/auth/types/LoginCredentials'
import type { RegisterData } from '@/domain/auth/types/RegisterData'
import type { AuthResponse } from '@/domain/auth/types/AuthResponse'

export class AuthRepositoryImpl implements AuthRepository {

    async login(
        credentials: LoginCredentials
    ): Promise<AuthResponse> {

        const response = await api.post('/auth/login', credentials)

        return {
            user: response.data.user,
            accessToken: response.data.access_token,
            tokenType: response.data.token_type
        }
    }

    async register(
        data: RegisterData
    ): Promise<AuthResponse> {

        const response = await api.post('/auth/register', data)

        return {
            user: response.data.user,
            accessToken: response.data.access_token,
            tokenType: response.data.token_type
        }
    }

    async logout(): Promise<void> {

        await api.post('/logout')
    }
}