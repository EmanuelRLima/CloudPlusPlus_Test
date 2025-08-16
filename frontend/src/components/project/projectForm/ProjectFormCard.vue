<template>
  <div class="card">
    <div class="card-header">
      <h2 class="text-lg font-medium text-gray-900">Project Information</h2>
    </div>
    <div class="card-body">

      <div v-if="!isFormReady" class="flex justify-center py-12">
        <div class="text-center">
          <div class="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p class="text-sm text-gray-500">Loading form...</p>
        </div>
      </div>

      <form v-else @submit.prevent="$emit('submit')" class="space-y-6">
        <BaseInput
          id="name"
          :model-value="form.name"
          label="Project Name"
          placeholder="Enter project name"
          :error="errors.name"
          required
          @update:model-value="updateForm('name', $event)"
        />

        <BaseTextarea
          id="description"
          :model-value="form.description"
          label="Description"
          placeholder="Describe your project..."
          :error="errors.description"
          @update:model-value="updateForm('description', $event)"
        />

        <BaseInput
          id="value"
          :model-value="form.value"
          label="Project Value"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          prefix="$"
          :error="errors.value"
          required
          @update:model-value="updateForm('value', $event)"
        />

        <ProjectDateFields
          :start-date="form.start_date"
          :end-date="form.end_date"
          :start-error="errors.start_date"
          :end-error="errors.end_date"
          @update:start-date="updateForm('start_date', $event)"
          @update:end-date="updateForm('end_date', $event)"
        />

        <BaseSelect
          v-if="isEditing"
          id="status"
          :model-value="form.status"
          label="Status"
          :options="statusOptions"
          :error="errors.status"
          @update:model-value="updateForm('status', $event)"
        />

        <ProjectFormActions
          :is-editing="isEditing"
          :is-loading="isLoading"
        />
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { PROJECT_STATUS } from '@/components/utils/constants'

import BaseInput from '@/components/common/BaseInput.vue'
import BaseTextarea from '@/components/common/BaseTextarea.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import ProjectDateFields from './ProjectFormDateField.vue'
import ProjectFormActions from './ProjectFormActions.vue'

const {
  form,
  errors,
  isEditing,
  isLoading,
  isFormReady
} = defineProps({
  form: {
    type: Object,
    required: true
  },
  errors: {
    type: Object,
    default: () => ({})
  },
  isEditing: {
    type: Boolean,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  isFormReady: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'update-form'])

const statusOptions = computed(() => [
  { value: PROJECT_STATUS.ACTIVE, label: 'Active' },
  { value: PROJECT_STATUS.INACTIVE, label: 'Inactive' }
])

function updateForm(field, value) {
  emit('update-form', field, value)
}
</script>
