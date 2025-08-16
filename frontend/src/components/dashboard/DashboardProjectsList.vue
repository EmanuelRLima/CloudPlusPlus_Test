<template>
  <div class="divide-y divide-gray-200">
    <ProjectItem
      v-for="project in projects"
      :key="project.id"
      :project="project"
    />
  </div>
</template>

<script setup>
import ProjectItem from '@/components/dashboard/DashboardProjectItem.vue'

defineProps({
  projects: {
    type: Array,
    required: true
  }
})
</script>
