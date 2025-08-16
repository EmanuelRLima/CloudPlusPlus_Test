<template>
  <div class="card hover:shadow-lg transition-shadow duration-200">
    <div class="card-body">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-3">
          <div class="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
            <FolderIcon class="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-900">{{ project.name }}</h3>
            <StatusBadge :status="project.status" />
          </div>
        </div>
        <ProjectCardMenu
          :project="project"
          @delete="$emit('delete', project)"
        />
      </div>

      <p class="text-sm text-gray-600 mb-4 line-clamp-2">
        {{ project.description || 'No description available' }}
      </p>

      <ProjectCardDetails :project="project" />

      <div class="mt-6 flex space-x-3">
        <router-link
          :to="`/projects/${project.id}`"
          class="flex-2 btn-primary text-center"
        >
          <MagnifyingGlassCircleIcon class="h-5 w-5 mr-2" />
          <span>View Details</span>
        </router-link>
        <router-link
          :to="`/projects/${project.id}/tasks`"
          class="flex-1 btn-secondary text-center"
        >
          <ArchiveBoxIcon class="h-5 w-5 mr-2" />
          <span>Tasks</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  FolderIcon,
  MagnifyingGlassCircleIcon,
  ArchiveBoxIcon
} from '@heroicons/vue/24/outline'
import StatusBadge from '@/components/common/StatusBadge.vue'
import ProjectCardMenu from './ProjectCardMenu.vue'
import ProjectCardDetails from './ProjectCardDetails.vue'

defineProps({
  project: {
    type: Object,
    required: true
  }
})

defineEmits(['delete'])
</script>
