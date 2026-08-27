<script setup lang="ts">

import { ref } from 'vue'
import { useRouter } from 'vue-router'

import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'

import { useAuthStore } from '@/presentation/stores/authStore'

const router = useRouter()

const authStore = useAuthStore()

const email = ref('')
const password = ref('')

const errors = ref<string | null>(null)

async function submit() {

    errors.value = null

    if (!email.value || !password.value) {

        errors.value = 'Debe ingresar email y contraseña'

        return
    }

    try {

        await authStore.login({
            email: email.value,
            password: password.value
        })

        router.push('/dashboard')

    } catch {

        errors.value = 'Email o contraseña incorrectos'
    }
}

</script>

<template>

    <form class="auth-form" @submit.prevent="submit">
        <div class="auth-field">
            <label for="email">Correo electrónico</label>

            <InputText
                id="email"
                v-model="email"
                type="email"
                autocomplete="email"
                placeholder="nombre@empresa.com"
            />
        </div>

        <div class="auth-field">
            <label for="password">Contraseña</label>

            <Password
                id="password"
                v-model="password"
                :feedback="false"
                toggleMask
                autocomplete="current-password"
            />
        </div>

        <Message
            v-if="errors"
            severity="error"
        >
            {{ errors }}
        </Message>

        <Button
            type="submit"
            label="Iniciar sesión"
            :loading="authStore.loading"
            class="auth-submit"
        />
    </form>

</template>