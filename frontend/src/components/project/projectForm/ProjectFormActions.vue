<template>
  <div class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
    <router-link to="/projects" class="btn-secondary">
      Cancel
    </router-link>
    <button
      type="submit"
      :disabled="isLoading"
      class="btn-primary"
    >
      <LoadingSpinner v-if="isLoading" />
      {{ buttonText }}
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import LoadingSpinner from '../../common/LoadingSpinner.vue'

const props = defineProps({
  isEditing: {
    type: Boolean,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const buttonText = computed(() => {
  if (props.isLoading) {
    return props.isEditing ? 'Updating...' : 'Creating...'
  }
  return props.isEditing ? 'Update Project' : 'Create Project'
})
</script>
