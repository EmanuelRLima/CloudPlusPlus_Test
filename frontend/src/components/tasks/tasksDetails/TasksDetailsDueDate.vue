<template>
  <div class="space-y-4">
    <h3 class="text-sm font-medium text-gray-700">Due Date</h3>
    <div class="flex items-center space-x-3">
      <CalendarIcon class="h-5 w-5 text-gray-400" />
      <span
        :class="[
          'text-lg font-semibold',
          isTaskOverdue(task.due_date) && task.status !== 'completed'
            ? 'text-red-600'
            : task.status === 'completed'
            ? 'text-gray-500'
            : 'text-gray-900'
        ]"
      >
        {{ formatDate(task.due_date) }}
      </span>
      <span
        v-if="isTaskOverdue(task.due_date) && task.status !== 'completed'"
        class="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800"
      >
        Overdue
      </span>
      <span
        v-else-if="task.status !== 'completed'"
        class="text-sm text-gray-500"
      >
        {{ getDaysUntilDue(task.due_date) }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { CalendarIcon } from '@heroicons/vue/24/outline'
import { useFormatters } from '@/composables/useFormatters.js'

const { formatDate, getDaysUntilDue } = useFormatters()

defineProps({
  task: {
    type: Object,
    required: true
  }
})

function isTaskOverdue(dueDate) {
  return new Date(dueDate) < new Date()
}
</script>
