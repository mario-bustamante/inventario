import type { AuthRepository } from '@/domain/auth/repositories/AuthRepository'
import type { RegisterData } from '@/domain/auth/types/RegisterData'
import type { AuthResponse } from '@/domain/auth/types/AuthResponse'

export class RegisterUseCase {

    constructor(
        private readonly authRepository: AuthRepository
    ) {}

    async execute(
        data: RegisterData
    ): Promise<AuthResponse> {

        return await this.authRepository.register(data)
    }
}