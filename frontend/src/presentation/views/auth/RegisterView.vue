<script setup lang="ts">

import RegisterForm from '@/presentation/components/auth/RegisterForm.vue'

</script>

<template>
    <main class="auth-page">
        <section class="auth-panel">
            <div class="auth-brand">
                <span>Sistema de Inventario</span>
            </div>

            <div class="auth-heading">
                <h1>Crea tu cuenta</h1>
            </div>

            <RegisterForm />

            <p class="auth-footer">
                ¿Ya tienes una cuenta?
                <RouterLink :to="{ name: 'login' }">Iniciar sesión</RouterLink>
            </p>
        </section>
    </main>
</template>