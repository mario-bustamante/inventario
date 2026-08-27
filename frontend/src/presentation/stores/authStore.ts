import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { User } from '@/domain/auth/entities/User'
import type { LoginCredentials } from '@/domain/auth/types/LoginCredentials'
import type { RegisterData } from '@/domain/auth/types/RegisterData'

import { AuthRepositoryImpl } from '@/infrastructure/auth/AuthRepositoryImpl'
import { LoginUseCase } from '@/application/auth/LoginUseCase'
import { RegisterUseCase } from '@/application/auth/RegisterUseCase'

export const useAuthStore = defineStore('auth', () => {

    const user = ref<User | null>(null)

    const accessToken = ref<string | null>(null)

    const loading = ref(false)

    const error = ref<string | null>(null)

    const repository = new AuthRepositoryImpl()

    const loginUseCase = new LoginUseCase(repository)

    const registerUseCase = new RegisterUseCase(repository)

    async function login(credentials: LoginCredentials) {

        loading.value = true
        error.value = null

        try {

            const response =
                await loginUseCase.execute(credentials)

            user.value = response.user
            accessToken.value = response.accessToken

        } catch (e) {

            error.value = 'Credenciales incorrectas'

            throw e

        } finally {

            loading.value = false
        }
    }

    async function register(data: RegisterData) {

        loading.value = true
        error.value = null

        try {

            const response =
                await registerUseCase.execute(data)

            user.value = response.user
            accessToken.value = response.accessToken

        } catch (e) {

            error.value = 'No fue posible registrar el usuario'

            throw e

        } finally {

            loading.value = false
        }
    }

    return {
        user,
        accessToken,
        loading,
        error,
        login,
        register
    }
})