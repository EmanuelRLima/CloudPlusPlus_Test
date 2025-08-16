<template>
  <div class="card">
    <div class="card-header">
      <h2 class="text-lg font-medium text-gray-900">Task Info</h2>
    </div>
    <div class="card-body">
      <dl class="space-y-4">
        <div class="flex justify-between">
          <dt class="text-sm font-medium text-gray-500">Created</dt>
          <dd class="text-sm text-gray-900">{{ formatDate(task.created_at) }}</dd>
        </div>
        <div class="flex justify-between">
          <dt class="text-sm font-medium text-gray-500">Last Updated</dt>
          <dd class="text-sm text-gray-900">{{ formatDate(task.updated_at) }}</dd>
        </div>
        <div v-if="task.due_date" class="flex justify-between">
          <dt class="text-sm font-medium text-gray-500">Time Remaining</dt>
          <dd class="text-sm text-gray-900">
            <span
              :class="[
                isTaskOverdue(task.due_date) && task.status !== 'completed'
                  ? 'text-red-600 font-medium'
                  : 'text-gray-900'
              ]"
            >
              {{ getDaysUntilDue(task.due_date) }}
            </span>
          </dd>
        </div>
        <div v-if="task.status === 'completed'">
          <dt class="text-sm font-medium text-gray-500">Completed</dt>
          <dd class="text-sm text-gray-900">
            <div class="flex items-center space-x-2">
              <CheckCircleIcon class="h-4 w-4 text-green-500" />
              <span>{{ formatDate(task.updated_at) }}</span>
            </div>
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script setup>
import { CheckCircleIcon } from '@heroicons/vue/24/outline'

defineProps({
  task: {
    type: Object,
    required: true
  }
})

function isTaskOverdue(dueDate) {
  return new Date(dueDate) < new Date()
}

function getDaysUntilDue(dueDate) {
  const today = new Date()
  const due = new Date(dueDate)
  const diffTime = due - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return `${Math.abs(diffDays)} days overdue`
  } else if (diffDays === 0) {
    return 'Due today'
  } else if (diffDays === 1) {
    return 'Due tomorrow'
  } else if (diffDays < 7) {
    return `${diffDays} days remaining`
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} week${weeks > 1 ? 's' : ''} remaining`
  } else {
    const months = Math.floor(diffDays / 30)
    return `${months} month${months > 1 ? 's' : ''} remaining`
  }
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
</script>
