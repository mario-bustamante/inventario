<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/presentation/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()
const isSidebarOpen = ref(false)
const openMenu = ref<string | null>(null)

interface MenuItem {
  label?: string
  heading?: string
  icon?: string
  to?: { name: string }
  children?: MenuItem[]
}

const menuItems: MenuItem[] = [
    {
    heading: 'Accesos',
  },
  {
    label: 'Roles y permisos',
    icon: 'pi pi-lock',
  },
  {
    label: 'Usuarios',
    icon: 'pi pi-users',
  },
  {
    label: 'Configuraciones',
    icon: 'pi pi-cog',
    children: [
      { label: 'Sucursales' },
      { label: 'Almacenes' },
      { label: 'Categorías' },
      { label: 'Proveedores' },
      { label: 'Unidades' },
    ],
  },
  {
    heading: 'Comercial',
  },
  {
    label: 'Productos',
    icon: 'pi pi-box',
    children: [
      { label: 'Registrar' },
      { label: 'Listado' },
    ],
  },
  {
    label: 'Clientes',
    icon: 'pi pi-user-plus',
  },
  {
    label: 'Ventas',
    icon: 'pi pi-dollar',
    children: [
      { label: 'Registrar' },
      { label: 'Listado' },
    ],
  },
  {
    label: 'Devolución',
    icon: 'pi pi-replay',
  },
  {
    heading: 'Almacén',
  },
  {
    label: 'Compras',
    icon: 'pi pi-shopping-cart',
    children: [
      { label: 'Registrar' },
      { label: 'Listado' },
    ],
  },
  {
    label: 'Transporte',
    icon: 'pi pi-truck',
    children: [
      { label: 'Registrar' },
      { label: 'Listado' },
    ],
  },
  {
    label: 'Conversión',
    icon: 'pi pi-sync',
  },
  {
    label: 'Kardex',
    icon: 'pi pi-book',
    },
]


async function logout() {
  await authStore.logout()
  router.push({ name: 'login' })
}

function closeSidebar() {
  isSidebarOpen.value = false
}

function toggleMenu(label: string) {
  openMenu.value = openMenu.value === label ? null : label
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
          <template
          v-for="item in menuItems"
            :key="item.heading ?? item.label"
        >
            <p v-if="item.heading" class="app-nav-heading">
              {{ item.heading }}
            </p>

            <RouterLink
              v-else-if="item.to"
              class="app-nav-item"
              :to="item.to"
              @click="closeSidebar"
            >
              <i :class="item.icon" aria-hidden="true" />
              <span>{{ item.label }}</span>
            </RouterLink>

            <div v-else-if="item.children" class="app-nav-group">
              <button
                class="app-nav-item app-nav-group-trigger"
                type="button"
                :aria-expanded="openMenu === item.label"
                @click="toggleMenu(item.label ?? '')"
              >
                <i :class="item.icon" aria-hidden="true" />
                <span>{{ item.label }}</span>
                <i
                  class="pi pi-angle-down app-nav-chevron"
                  :class="{ 'is-open': openMenu === item.label }"
                  aria-hidden="true"
                />
              </button>

              <div v-if="openMenu === item.label" class="app-nav-submenu">
                <button
                  v-for="child in item.children"
                  :key="child.label"
                  class="app-nav-subitem"
                  type="button"
                  @click="closeSidebar"
                >
                  <i class="pi pi-circle-fill" aria-hidden="true" />
                  <span>{{ child.label }}</span>
                </button>
              </div>
            </div>

            <button v-else class="app-nav-item app-nav-placeholder" type="button">
              <i :class="item.icon" aria-hidden="true" />
              <span>{{ item.label }}</span>
            </button>
          </template>

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
