<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'

export interface NewRole {
  name: string
  permissions: string[]
}

const isVisible = defineModel<boolean>({ default: false })
const emit = defineEmits<{
  addRole: [role: NewRole]
}>()

const name = ref('')
const permissions = ref<string[]>([])
const errorMessage = ref('')

const permissionGroups = [
  {
    label: 'Accesos',
    permissions: ['Gestionar roles', 'Gestionar usuarios'],
  },
  {
    label: 'Comercial',
    permissions: ['Gestionar productos', 'Gestionar clientes', 'Gestionar ventas'],
  },
  {
    label: 'Almacén',
    permissions: ['Gestionar compras', 'Gestionar transporte', 'Consultar kardex'],
  },
]

const canSave = computed(() => name.value.trim().length > 0 && permissions.value.length > 0)

function closeDialog() {
  isVisible.value = false
  errorMessage.value = ''
}

function saveRole() {
  if (!canSave.value) {
    errorMessage.value = 'Indica el nombre del rol y selecciona al menos un permiso.'
    return
  }

  emit('addRole', {
    name: name.value.trim(),
    permissions: [...permissions.value],
  })

  name.value = ''
  permissions.value = []
  closeDialog()
}
</script>

<template>
  <Dialog
    v-model:visible="isVisible"
    modal
    header="Nuevo rol"
    :style="{ width: 'min(42rem, calc(100vw - 2rem))' }"
  >
    <form class="role-dialog-form" @submit.prevent="saveRole">
      <div class="auth-field">
        <label for="role-name">Nombre del rol</label>
        <InputText
          id="role-name"
          v-model="name"
          autocomplete="off"
          placeholder="Ej.: Supervisor de almacén"
        />
      </div>

      <fieldset class="role-permissions-fieldset">
        <legend>Permisos</legend>

        <div class="role-permission-groups">
          <section v-for="group in permissionGroups" :key="group.label">
            <h3>{{ group.label }}</h3>
            <label
              v-for="permission in group.permissions"
              :key="permission"
              class="role-permission-option"
            >
              <Checkbox
                v-model="permissions"
                :input-id="permission"
                name="permissions"
                :value="permission"
              />
              <span>{{ permission }}</span>
            </label>
          </section>
        </div>
      </fieldset>

      <Message v-if="errorMessage" severity="error">
        {{ errorMessage }}
      </Message>
    </form>

    <template #footer>
      <Button
        label="Cancelar"
        severity="secondary"
        text
        @click="closeDialog"
      />
      <Button
        icon="pi pi-check"
        label="Guardar rol"
        @click="saveRole"
      />
    </template>
  </Dialog>
</template>
