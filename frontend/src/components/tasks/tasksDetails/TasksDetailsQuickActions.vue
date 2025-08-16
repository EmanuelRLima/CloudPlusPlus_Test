<template>
  <div class="card">
    <div class="card-header">
      <h2 class="text-lg font-medium text-gray-900">Quick Actions</h2>
    </div>
    <div class="card-body">
      <div class="space-y-3">
        <button
          @click="$emit('toggle-status')"
          :disabled="isLoading"
          class="w-full btn-primary"
        >
          <CheckCircleIcon class="h-4 w-4 mr-2" />
          {{ task.status === 'completed' ? 'Mark as Pending' : 'Mark as Completed' }}
        </button>
        <router-link
          :to="`/projects/${projectId}/tasks/${task.id}/edit`"
          class="w-full btn-secondary text-center"
        >
          <PencilIcon class="h-4 w-4 mr-2" />
          Edit Task
        </router-link>
        <router-link
          :to="`/projects/${projectId}/tasks/create`"
          class="w-full btn-secondary text-center"
        >
          <PlusIcon class="h-4 w-4 mr-2" />
          Create New Task
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { CheckCircleIcon, PencilIcon, PlusIcon } from '@heroicons/vue/24/outline'

defineProps({
  task: {
    type: Object,
    required: true
  },
  projectId: {
    type: [String, Number],
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle-status'])
</script>
