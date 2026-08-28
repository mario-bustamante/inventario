<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/presentation/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()
const isSidebarOpen = ref(false)

const menuItems = [
  {
    label: 'Dashboard',
    icon: 'pi pi-th-large',
    to: { name: 'dashboard' },
  },
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

function closeSidebar() {
  isSidebarOpen.value = false
}
</script>

<template>
  <div class="app-shell">
    <aside class="app-sidebar" :class="{ 'is-open': isSidebarOpen }">
      <RouterLink class="app-brand" :to="{ name: 'dashboard' }">
        <span class="app-brand-mark">I</span>
        <span>Inventario</span>
      </RouterLink>

        <p v-if="authStore.user" class="app-user-name">
            {{ authStore.user.name }}
        </p>

      <nav class="app-navigation" aria-label="Navegación principal">
        <RouterLink
          v-for="item in menuItems"
          :key="item.label"
          class="app-nav-item"
          :to="item.to"
          @click="closeSidebar"
        >
          <i :class="item.icon" aria-hidden="true" />
          <span>{{ item.label }}</span>
        </RouterLink>

        <Button
          class="app-nav-item app-nav-action"
          icon="pi pi-times"
          label="Salir"
          :loading="authStore.loading"
          @click="logout"
        />
      </nav>

      <div class="app-sidebar-footer">


      </div>
    </aside>

    <div class="app-workspace">
      <header class="app-header">
        <button
          class="app-menu-toggle"
          type="button"
          aria-label="Abrir menú"
          :aria-expanded="isSidebarOpen"
          @click="isSidebarOpen = !isSidebarOpen"
        >
          <i class="pi pi-bars" aria-hidden="true" />
        </button>

        <div class="app-header-title">
          <span>Administración</span>
          <small>Gestión operativa</small>
        </div>

        <div class="app-header-user">
          <span class="app-user-initial">
            {{ authStore.user?.name?.charAt(0).toUpperCase() ?? 'U' }}
          </span>
          <span>{{ authStore.user?.name ?? 'Usuario' }}</span>
        </div>
      </header>

      <main class="app-content">
        <RouterView />
      </main>
    </div>

    <button
      v-if="isSidebarOpen"
      class="app-sidebar-backdrop"
      type="button"
      aria-label="Cerrar menú"
      @click="closeSidebar"
    />
  </div>
</template>
