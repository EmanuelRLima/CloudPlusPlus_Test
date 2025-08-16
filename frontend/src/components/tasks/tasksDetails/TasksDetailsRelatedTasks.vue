<template>
  <div class="card">
    <div class="card-header">
      <h2 class="text-lg font-medium text-gray-900">Other Tasks</h2>
    </div>
    <div class="card-body">
      <div class="space-y-3">
        <div
          v-for="relatedTask in tasks"
          :key="relatedTask.id"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          @click="$emit('navigate-to-task', relatedTask.id)"
        >
          <div class="flex items-center space-x-3">
            <input
              v-if="isProjectOwner"
              type="checkbox"
              :checked="relatedTask.status === 'completed'"
              @click.stop
              @change="$emit('toggle-task-status', relatedTask)"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <div class="flex-1">
              <p
                :class="[
                  'text-sm font-medium truncate',
                  relatedTask.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
                ]"
              >
                {{ relatedTask.title }}
              </p>
              <p class="text-xs text-gray-500">
                {{ relatedTask.priority }} Priority
              </p>
            </div>
          </div>
          <ChevronRightIcon class="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ChevronRightIcon } from '@heroicons/vue/24/outline'

defineProps({
  tasks: {
    type: Array,
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

defineEmits(['navigate-to-task', 'toggle-task-status'])
</script>
