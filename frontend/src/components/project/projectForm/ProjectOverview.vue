<template>
  <div class="card">
    <div class="card-header">
      <h2 class="text-lg font-medium text-gray-900">Project Overview</h2>
    </div>
    <div class="card-body">
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div class="space-y-4">
          <ProjectOverviewItem label="Current Status">
            <StatusBadge :status="project.status || 'inactive'" />
          </ProjectOverviewItem>

          <ProjectOverviewItem label="Created">
            {{ formatDate(project.created_at) }}
          </ProjectOverviewItem>

          <ProjectOverviewItem label="Last Updated">
            {{ formatDate(project.updated_at) }}
          </ProjectOverviewItem>
        </div>

        <div class="space-y-4">
          <ProjectOverviewItem label="Duration">
            {{ calculateDuration(project.start_date, project.end_date) }}
          </ProjectOverviewItem>

          <ProjectOverviewItem label="Tasks">
            {{ project.tasks_count || 0 }} tasks
          </ProjectOverviewItem>

          <ProjectOverviewItem label="Actions">
            <div class="flex space-x-2">
              <router-link
                :to="`/projects/${project.id}/tasks`"
                class="btn-secondary text-xs"
              >
                View Tasks
              </router-link>
            </div>
          </ProjectOverviewItem>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFormatters } from '@/composables/useFormatters'
import StatusBadge from '@/components/common/StatusBadge.vue'
import ProjectOverviewItem from './ProjectOverviewItem.vue'

defineProps({
  project: {
    type: Object,
    required: true
  }
})

const { formatDate, calculateDuration } = useFormatters()
</script>
