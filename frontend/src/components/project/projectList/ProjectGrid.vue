<template>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    <ProjectCard
      v-for="project in projects"
      :key="project.id"
      :project="project"
      @delete="$emit('delete', $event)"
    />
  </div>
</template>

<script setup>
import ProjectCard from './ProjectCard.vue'

defineProps({
  projects: {
    type: Array,
    required: true
  }
})

defineEmits(['delete'])
</script>
