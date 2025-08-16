<template>
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">
        {{ isEditing ? 'Edit Task' : 'Create New Task' }}
      </h1>
      <p class="mt-2 text-sm text-gray-700">
        {{ isEditing ? 'Update your task details' : 'Add a new task to your project' }}
      </p>
      <p v-if="projectName" class="mt-1 text-sm text-gray-500">
        Project: <span class="font-medium">{{ projectName }}</span>
      </p>
    </div>
    <router-link :to="`/projects/${projectId}/tasks`" class="btn-secondary">
      <ArrowLeftIcon class="h-5 w-5 mr-2" />
      Back to Tasks
    </router-link>
  </div>
</template>

<script setup>
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'

defineProps({
  isEditing: {
    type: Boolean,
    required: true
  },
  projectName: {
    type: String,
    default: null
  },
  projectId: {
    type: [String, Number],
    required: true
  }
})
</script>
