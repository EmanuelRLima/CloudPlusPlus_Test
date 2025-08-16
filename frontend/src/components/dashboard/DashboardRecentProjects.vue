<template>
  <div class="card">
    <div class="card-header">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-medium text-gray-900">Recent Projects</h2>
        <router-link to="/projects" class="text-sm text-primary-600 hover:text-primary-500">
          View all
        </router-link>
      </div>
    </div>
    <div class="card-body p-0">
      <LoadingSkeleton v-if="loading" />
      <EmptyState v-else-if="projects.length === 0" />
      <ProjectsList v-else :projects="projects" />
    </div>
  </div>
</template>

<script setup>
import LoadingSkeleton from '@/components/common/LoadingSkeleton.vue'
import EmptyState from '@/components/dashboard/DashboardEmptyState.vue'
import ProjectsList from '@/components/dashboard/DashboardProjectsList.vue'

defineProps({
  projects: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>
