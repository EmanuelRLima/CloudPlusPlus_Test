<template>
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">
        {{ isEditing ? 'Edit Project' : 'Create New Project' }}
      </h1>
      <p class="mt-2 text-sm text-gray-700">
        {{ isEditing ? 'Update your project details' : 'Fill in the information below to create a new project' }}
      </p>
    </div>
    <router-link to="/projects" class="btn-secondary">
      <ArrowLeftIcon class="h-5 w-5 mr-2" />
      Back to Projects
    </router-link>
  </div>
</template>

<script setup>
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'

defineProps({
  isEditing: {
    type: Boolean,
    required: true
  }
})
</script>
