<template>
  <div class="p-6 text-center">
    <FolderIcon class="mx-auto h-12 w-12 text-gray-400" />
    <h3 class="mt-2 text-sm font-medium text-gray-900">No projects</h3>
    <p class="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
    <div class="mt-6">
      <router-link to="/projects/create" class="btn-primary">
        <PlusIcon class="h-4 w-4 mr-2" />
        New Project
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { FolderIcon, PlusIcon } from '@heroicons/vue/24/outline'
</script>
