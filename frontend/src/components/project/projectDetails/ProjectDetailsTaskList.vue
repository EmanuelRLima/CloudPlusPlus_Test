<template>
  <div class="space-y-3">
    <h4 class="text-sm font-medium text-gray-700">Recent Tasks</h4>
    <div class="space-y-2">
      <div
        v-for="task in tasks"
        :key="task.id"
        class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div class="flex items-center space-x-3">
          <input
            v-if="isProjectOwner(authStore, project) && project.status !== 'inactive'"
            type="checkbox"
            :checked="task.status === 'completed'"
            @change="$emit('toggle-task', task)"
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <span
            :class="[
              'text-sm',
              task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
            ]"
          >
            {{ task.title }}
          </span>
        </div>
        <div class="flex items-center space-x-2">
          <StatusBadge :status="task.status" size="xs" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import StatusBadge from '@/components/common/StatusBadge.vue'
import { useAuthStore } from '@/stores/auth'
import { isProjectOwner } from '@/components/utils/utils.js'

const authStore = useAuthStore()

defineProps({
  project: {
    type: Object,
    required: true
  },
  tasks: {
    type: Array,
    default: () => []
  }
})

defineEmits(['toggle-task'])
</script>
