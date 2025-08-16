<template>
  <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0">
    <div class="items-start space-x-4">
      <router-link :to="`/projects/${projectId}/tasks`" class="btn-secondary mt-1">
        <ArrowLeftIcon class="h-5 w-5 mr-2" />
        Back to Tasks
      </router-link>
      <div class="flex-1">
        <div class="flex items-start space-x-3">
          <div class="flex-1">
            <h1
              :class="[
                'text-3xl font-bold mt-2',
                task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
              ]"
            >
              {{ task.title }}
            </h1>
            <div class="flex flex-wrap items-center gap-4 mt-3">
              <span class="text-sm text-gray-500">
                Created {{ formatDate(task.created_at) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <TaskHeaderActions
      v-if="isProjectOwner"
      :task="task"
      :project-id="projectId"
      @toggle-status="$emit('toggle-status')"
      @delete-task="$emit('delete-task')"
    />
  </div>
</template>

<script setup>
import TaskHeaderActions from './TasksDetailsHeaderActions.vue'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'

defineProps({
  task: {
    type: Object,
    required: true
  },
  projectId: {
    type: [String, Number],
    required: true
  },
  isProjectOwner: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle-status', 'delete-task'])

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
</script>
