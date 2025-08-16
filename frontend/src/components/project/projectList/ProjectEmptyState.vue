<template>
  <div class="card">
    <div class="card-body text-center py-12">
      <FolderIcon class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">No projects found</h3>
      <p class="mt-1 text-sm text-gray-500">
        {{ hasFilters ? 'Try adjusting your filters' : 'Get started by creating a new project' }}
      </p>
      <div class="mt-6">
        <router-link v-if="!hasFilters" to="/projects/create" class="btn-primary">
          <PlusIcon class="h-4 w-4 mr-2" />
          New Project
        </router-link>
        <button v-else @click="$emit('clear-filters')" class="btn-secondary">
          Clear Filters
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { FolderIcon, PlusIcon } from '@heroicons/vue/24/outline'

defineProps({
  hasFilters: {
    type: Boolean,
    required: true
  }
})

defineEmits(['clear-filters'])
</script>
