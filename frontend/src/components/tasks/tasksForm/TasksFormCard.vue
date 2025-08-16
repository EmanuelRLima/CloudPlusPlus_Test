<template>
  <div class="card">
    <div class="card-header">
      <h2 class="text-lg font-medium text-gray-900">Task Information</h2>
    </div>
    <div class="card-body">
      <form @submit.prevent="$emit('submit')" class="space-y-6">
        <BaseInput
          id="title"
          :model-value="form.title"
          @update:model-value="$emit('update:form', { ...form, title: $event })"
          label="Task Title"
          placeholder="Enter task title"
          :error="errors.title"
          required
        />

        <BaseTextarea
          id="description"
          :model-value="form.description"
          @update:model-value="$emit('update:form', { ...form, description: $event })"
          label="Description"
          placeholder="Enter task description"
          :rows="3"
          :error="errors.description"
        />

        <BaseSelect
          id="status"
          :model-value="form.status"
          @update:model-value="$emit('update:form', { ...form, status: $event })"
          label="Status"
          :options="statusOptions"
          :error="errors.status"
        />

        <BaseInput
          id="due_date"
          :model-value="form.due_date"
          @update:model-value="$emit('update:form', { ...form, due_date: $event })"
          type="date"
          label="Due Date"
          :error="errors.due_date"
        />

        <TaskFormActions
          :is-loading="isLoading"
          :is-editing="isEditing"
          :project-id="projectId"
        />
      </form>
    </div>
  </div>
</template>

<script setup>
import BaseInput from '@/components/common/BaseInput.vue'
import BaseTextarea from '@/components/common/BaseTextarea.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import TaskFormActions from './TasksFormActions.vue'

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'inactive', label: 'Inactive' }
]

defineProps({
  form: {
    type: Object,
    required: true
  },
  errors: {
    type: Object,
    default: () => ({})
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  isEditing: {
    type: Boolean,
    required: true
  },
  projectId: {
    type: [String, Number],
    required: true
  }
})

defineEmits(['submit', 'update:form'])
</script>
