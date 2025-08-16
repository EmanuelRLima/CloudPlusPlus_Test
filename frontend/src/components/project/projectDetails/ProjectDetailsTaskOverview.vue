<template>
  <div class="card">
    <div class="card-header">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-medium text-gray-900">Tasks Overview</h2>
        <router-link
          :to="`/projects/${project.id}/tasks`"
          class="text-primary-600 hover:text-primary-500 text-sm font-medium"
        >
          View All Tasks →
        </router-link>
      </div>
    </div>

    <div class="card-body">
      <LoadingSkeleton v-if="isLoading" />

      <TasksEmptyState
        v-else-if="tasks.length === 0"
        :project-id="project.id"
        :is-owner="isOwner"
      />

      <div v-else class="space-y-4">
        <TasksStats
          :total-tasks="totalTasks"
          :pending-tasks="pendingTasks"
          :completed-tasks="completedTasks"
        />

        <TasksList
          :tasks="tasks"
          :project="project"
          @toggle-task="$emit('toggle-task', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import LoadingSkeleton from '@/components/common/LoadingSkeleton.vue'
import TasksEmptyState from './ProjectDetailsTaskEmptyState.vue'
import TasksStats from './ProjectDetailsTaskStats.vue'
import TasksList from './ProjectDetailsTaskList.vue'

const tasksStore = useTasksStore()

defineProps({
  project: {
    type: Object,
    required: true
  },
  tasks: {
    type: Array,
    default: () => []
  },
  isOwner: {
    type: Boolean,
    default: false
  },
  progressPercentage: {
    type: Number,
    default: 0
  }
})

defineEmits(['toggle-task'])

const isLoading = computed(() => tasksStore.isLoading)
const totalTasks = computed(() => tasksStore.totalTasks)
const pendingTasks = computed(() => tasksStore.pendingTasks)
const completedTasks = computed(() => tasksStore.completedTasks)
</script>
