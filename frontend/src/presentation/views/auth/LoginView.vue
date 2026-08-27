<script setup lang="ts">

import LoginForm from '@/presentation/components/auth/LoginForm.vue'

</script>

<template>
    <main class="auth-page">
        <section class="auth-panel">
            <div class="auth-brand">
                <span>Sistema de Inventario</span>
            </div>

            <div class="auth-heading">
                <h1>Inicia sesión</h1>
            </div>

            <LoginForm />

            <p class="auth-footer">
                ¿Aún no tienes una cuenta?
                <RouterLink :to="{ name: 'register' }">Crear cuenta</RouterLink>
            </p>
        </section>
    </main>
</template>