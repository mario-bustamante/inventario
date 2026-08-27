<script setup lang="ts">
import Button from 'primevue/button'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/presentation/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const menuItems = [
  {
    label: 'Dashboard',
    icon: 'pi pi-th-large',
    to: { name: 'dashboard' },
  },
]

async function logout() {
  await authStore.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="app-shell">
    <aside class="app-sidebar">
      <RouterLink class="app-brand" :to="{ name: 'dashboard' }">
        <span class="app-brand-mark">I</span>
        <span>Inventario</span>
      </RouterLink>

      <nav class="app-navigation" aria-label="Navegación principal">
        <RouterLink
          v-for="item in menuItems"
          :key="item.label"
          class="app-nav-item"
          :to="item.to"
        >
          <i :class="item.icon" aria-hidden="true" />
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="app-sidebar-footer">
        <p v-if="authStore.user" class="app-user-name">
          {{ authStore.user.name }}
        </p>
        <Button
          class="app-logout"
          icon="pi pi-sign-out"
          label="Salir"
          severity="secondary"
          text
          :loading="authStore.loading"
          @click="logout"
        />
      </div>
    </aside>

    <main class="app-content">
      <RouterView />
    </main>
  </div>
</template>
