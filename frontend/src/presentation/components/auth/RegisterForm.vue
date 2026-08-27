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

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')

const errors = ref<string | null>(null)

async function submit() {

    errors.value = null

    if (!name.value ||
        !email.value ||
        !password.value ||
        !passwordConfirmation.value) {

        errors.value = 'Todos los campos son obligatorios'

        return
    }

    if (password.value !== passwordConfirmation.value) {

        errors.value = 'Las contraseñas no coinciden'

        return
    }

    try {

        await authStore.register({
            name: name.value,
            email: email.value,
            password: password.value,
            passwordConfirmation:
                passwordConfirmation.value
        })

        router.push('/dashboard')

    } catch {

        errors.value =
            'No fue posible registrar el usuario'
    }
}

</script>

<template>

    <form
        class="flex flex-column gap-4"
        @submit.prevent="submit"
    >

        <div class="flex flex-column gap-2">

            <label for="name">
                Nombre
            </label>

            <InputText
                id="name"
                v-model="name"
                autocomplete="name"
            />

        </div>

        <div class="flex flex-column gap-2">

            <label for="email">
                Email
            </label>

            <InputText
                id="email"
                v-model="email"
                type="email"
                autocomplete="email"
            />

        </div>

        <div class="flex flex-column gap-2">

            <label for="password">
                Contraseña
            </label>

            <Password
                id="password"
                v-model="password"
                toggleMask
            />

        </div>

        <div class="flex flex-column gap-2">

            <label for="passwordConfirmation">
                Confirmar contraseña
            </label>

            <Password
                id="passwordConfirmation"
                v-model="passwordConfirmation"
                :feedback="false"
                toggleMask
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
            label="Registrarse"
            :loading="authStore.loading"
        />

    </form>

</template>