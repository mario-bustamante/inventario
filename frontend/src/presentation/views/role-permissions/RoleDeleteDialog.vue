<script setup lang="ts">
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'

interface Role {
  id: number
  name: string
}

const isVisible = defineModel<boolean>({ default: false })
const props = defineProps<{
  role: Role | null
}>()
const emit = defineEmits<{
  deleteRole: [roleId: number]
}>()

function closeDialog() {
  isVisible.value = false
}

function deleteRole() {
  if (props.role)
    emit('deleteRole', props.role.id)

  closeDialog()
}
</script>

<template>
  <Dialog
    v-model:visible="isVisible"
    modal
    header="Eliminar rol"
    :style="{ width: 'min(28rem, calc(100vw - 2rem))' }"
  >
    <div class="role-delete-dialog">
      <span class="role-delete-icon">
        <i class="pi pi-exclamation-triangle" aria-hidden="true" />
      </span>
      <div>
        <p>¿Eliminar el rol <strong>{{ role?.name }}</strong>?</p>
        <span>Esta acción solo se refleja localmente hasta conectar el módulo con la API.</span>
      </div>
    </div>

    <template #footer>
      <Button label="Cancelar" severity="secondary" text @click="closeDialog" />
      <Button icon="pi pi-trash" label="Eliminar" severity="danger" @click="deleteRole" />
    </template>
  </Dialog>
</template>
