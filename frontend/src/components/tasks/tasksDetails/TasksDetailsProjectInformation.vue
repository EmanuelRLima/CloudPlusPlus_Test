<template>
  <div class="card">
    <div class="card-header">
      <h2 class="text-lg font-medium text-gray-900">Project Information</h2>
    </div>
    <div class="card-body">
      <div class="flex items-center space-x-4">
        <div class="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center">
          <FolderIcon class="h-6 w-6 text-primary-600" />
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-medium text-gray-900">
            <router-link
              :to="`/projects/${project.id}`"
              class="hover:text-primary-600 transition-colors"
            >
              {{ project.name }}
            </router-link>
          </h3>
          <p class="text-sm text-gray-500">
            {{ project.description || 'No description available' }}
          </p>
          <div class="flex items-center space-x-4 mt-2">
            <StatusBadge :status="project.status" />
            <span class="text-xs text-gray-500">
              Due {{ formatDate(project.end_date) }}
            </span>
          </div>
        </div>
        <router-link
          :to="`/projects/${project.id}`"
          class="btn-secondary"
        >
          View Project
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { FolderIcon } from '@heroicons/vue/24/outline'
import StatusBadge from '@/components/common/StatusBadge.vue'

defineProps({
  project: {
    type: Object,
    required: true
  }
})

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
</script>
