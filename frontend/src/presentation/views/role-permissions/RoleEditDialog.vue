<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'

interface Role {
  id: number
  name: string
  createdAt: string
  permissions: string[]
}

const isVisible = defineModel<boolean>({ default: false })
const props = defineProps<{
  role: Role | null
}>()
const emit = defineEmits<{
  editRole: [role: Role]
}>()

const name = ref('')
const permissions = ref<string[]>([])
const errorMessage = ref('')

const permissionGroups = [
  { label: 'Accesos', permissions: ['Gestionar roles', 'Gestionar usuarios'] },
  { label: 'Comercial', permissions: ['Gestionar productos', 'Gestionar clientes', 'Gestionar ventas'] },
  { label: 'Almacén', permissions: ['Gestionar compras', 'Gestionar transporte', 'Consultar kardex'] },
]

const canSave = computed(() => name.value.trim().length > 0 && permissions.value.length > 0)

watch(
  () => props.role,
  role => {
    name.value = role?.name ?? ''
    permissions.value = role ? [...role.permissions] : []
    errorMessage.value = ''
  },
  { immediate: true },
)

function closeDialog() {
  isVisible.value = false
  errorMessage.value = ''
}

function saveChanges() {
  if (!props.role || !canSave.value) {
    errorMessage.value = 'Indica el nombre del rol y selecciona al menos un permiso.'
    return
  }

  emit('editRole', {
    ...props.role,
    name: name.value.trim(),
    permissions: [...permissions.value],
  })
  closeDialog()
}
</script>

<template>
  <Dialog
    v-model:visible="isVisible"
    modal
    header="Editar rol"
    :style="{ width: 'min(42rem, calc(100vw - 2rem))' }"
  >
    <form class="role-dialog-form" @submit.prevent="saveChanges">
      <div class="auth-field">
        <label for="edit-role-name">Nombre del rol</label>
        <InputText
          id="edit-role-name"
          v-model="name"
          autocomplete="off"
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
                :input-id="`edit-${permission}`"
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
      <Button label="Cancelar" severity="secondary" text @click="closeDialog" />
      <Button icon="pi pi-check" label="Guardar cambios" @click="saveChanges" />
    </template>
  </Dialog>
</template>
