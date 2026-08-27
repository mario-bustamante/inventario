import type { AuthRepository } from '@/domain/auth/repositories/AuthRepository'
import type { LoginCredentials } from '@/domain/auth/types/LoginCredentials'
import type { AuthResponse } from '@/domain/auth/types/AuthResponse'

export class LoginUseCase {

    constructor(
        private readonly authRepository: AuthRepository
    ) {}

    async execute(
        credentials: LoginCredentials
    ): Promise<AuthResponse> {

        return await this.authRepository.login(credentials)
    }
}