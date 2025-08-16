<template>
  <div class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
    <router-link :to="`/projects/${projectId}/tasks`" class="btn-secondary">
      Cancel
    </router-link>
    <button
      type="submit"
      :disabled="isLoading"
      class="btn-primary"
    >
      <LoadingSpinner v-if="isLoading" />
      {{ loadingText }}
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const props = defineProps({
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

const loadingText = computed(() => {
  if (props.isLoading) {
    return props.isEditing ? 'Updating...' : 'Creating...'
  }
  return props.isEditing ? 'Update Task' : 'Create Task'
})
</script>
