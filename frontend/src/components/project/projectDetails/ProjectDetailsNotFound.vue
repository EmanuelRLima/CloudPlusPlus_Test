<template>
  <div class="text-center py-12">
    <ExclamationTriangleIcon class="mx-auto h-12 w-12 text-gray-400" />
    <h3 class="mt-2 text-sm font-medium text-gray-900">Project not found</h3>
    <p class="mt-1 text-sm text-gray-500">The project you're looking for doesn't exist.</p>
    <div class="mt-6">
      <router-link to="/projects" class="btn-primary">
        Back to Projects
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
</script>
