<template>
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
    <div class="items-center space-x-4">
      <router-link :to="`/projects/${projectId}`" class="btn-secondary">
        <ArrowLeftIcon class="h-5 w-5 mr-2" />
        Back to Project
      </router-link>
      <div class="mt-2">
        <h1 class="text-3xl font-bold text-gray-900">Tasks</h1>
        <p class="mt-2 text-sm text-gray-700">
          Manage tasks for {{ projectName }}
        </p>
      </div>
    </div>
    <div v-if="isOwner" class="flex items-center space-x-3">
      <router-link :to="`/projects/${projectId}/tasks/create`" class="btn-primary">
        <PlusIcon class="h-5 w-5 mr-2" />
        New Task
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeftIcon, PlusIcon } from '@heroicons/vue/24/outline'

defineProps({
  projectId: {
    type: String,
    required: true
  },
  projectName: {
    type: String,
    required: true
  },
  isOwner: {
    type: Boolean,
    default: false
  }
})
</script>
