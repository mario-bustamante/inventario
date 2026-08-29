<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'

import RoleAddDialog, { type NewRole } from './RoleAddDialog.vue'
import RoleDeleteDialog from './RoleDeleteDialog.vue'
import RoleEditDialog from './RoleEditDialog.vue'

interface Role {
  id: number
  name: string
  createdAt: string
  permissions: string[]
}

const searchQuery = ref('')
const roles = ref<Role[]>([])
const isRoleAddDialogVisible = ref(false)
const isRoleEditDialogVisible = ref(false)
const isRoleDeleteDialogVisible = ref(false)
const selectedRole = ref<Role | null>(null)

const filteredRoles = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase()

  if (!query)
    return roles.value

  return roles.value.filter(role => role.name.toLocaleLowerCase().includes(query))
})

function addRole(role: NewRole) {
  roles.value.unshift({
    id: Date.now(),
    name: role.name,
    createdAt: new Intl.DateTimeFormat('es-CL').format(new Date()),
    permissions: role.permissions,
  })
}

function openEditDialog(role: Role) {
  selectedRole.value = role
  isRoleEditDialogVisible.value = true
}

function openDeleteDialog(role: Role) {
  selectedRole.value = role
  isRoleDeleteDialogVisible.value = true
}

function updateRole(updatedRole: Role) {
  const index = roles.value.findIndex(role => role.id === updatedRole.id)

  if (index !== -1)
    roles.value.splice(index, 1, updatedRole)
}

function removeRole(roleId: number) {
  roles.value = roles.value.filter(role => role.id !== roleId)
}
</script>

<template>
  <section class="role-permissions-page">
    <header class="role-permissions-header">
      <div>
        <p class="dashboard-kicker">Accesos</p>
        <h1>Roles y permisos</h1>
      </div>

      <Button
        icon="pi pi-plus"
        label="Nuevo rol"
        @click="isRoleAddDialogVisible = true"
      />
    </header>

    <section class="role-permissions-table" aria-label="Listado de roles">
      <div class="role-permissions-toolbar">
        <IconField>
          <InputIcon class="pi pi-search" />
          <InputText
            v-model="searchQuery"
            placeholder="Buscar rol"
          />
        </IconField>

        <span class="role-permissions-count">
          {{ filteredRoles.length }} roles
        </span>
      </div>

      <DataTable
        :value="filteredRoles"
        data-key="id"
        striped-rows
      >
        <template #empty>
          <div class="role-permissions-empty">
            <i class="pi pi-shield" aria-hidden="true" />
            <strong>Aún no hay roles registrados</strong>
          </div>
        </template>

        <Column field="id" header="ID" />
        <Column field="name" header="Rol" />
        <Column field="createdAt" header="Fecha de registro" />
        <Column header="Permisos">
          <template #body="{ data }">
            <div class="role-permissions-tags">
              <Tag
                v-for="permission in data.permissions"
                :key="permission"
                :value="permission"
                severity="secondary"
              />
            </div>
          </template>
        </Column>
        <Column header="Acciones">
          <template #body="{ data }">
            <div class="role-permissions-actions">
              <Button
                v-tooltip.top="'Editar rol'"
                icon="pi pi-pencil"
                severity="secondary"
                text
                rounded
                @click="openEditDialog(data)"
              />
              <Button
                v-tooltip.top="'Eliminar rol'"
                icon="pi pi-trash"
                severity="danger"
                text
                rounded
                @click="openDeleteDialog(data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </section>

    <RoleAddDialog
      v-model="isRoleAddDialogVisible"
      @add-role="addRole"
    />
    <RoleEditDialog
      v-model="isRoleEditDialogVisible"
      :role="selectedRole"
      @edit-role="updateRole"
    />
    <RoleDeleteDialog
      v-model="isRoleDeleteDialogVisible"
      :role="selectedRole"
      @delete-role="removeRole"
    />
  </section>
</template>
