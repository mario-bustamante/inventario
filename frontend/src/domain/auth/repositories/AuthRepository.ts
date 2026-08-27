import type { LoginCredentials } from '../types/LoginCredentials'
import type { RegisterData } from '../types/RegisterData'
import type { AuthResponse } from '../types/AuthResponse'

export interface AuthRepository {

    login(
        credentials: LoginCredentials
    ): Promise<AuthResponse>

    register(
        data: RegisterData
    ): Promise<AuthResponse>

    logout(): Promise<void>
}