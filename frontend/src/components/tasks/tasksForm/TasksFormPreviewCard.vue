<template>
  <div class="card">
    <div class="card-header">
      <h2 class="text-lg font-medium text-gray-900">Task Overview</h2>
    </div>
    <div class="card-body">
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div class="space-y-4">
          <div>
            <dt class="text-sm font-medium text-gray-500">Current Status</dt>
            <dd class="mt-1">
              <StatusBadge :status="task.status" />
            </dd>
          </div>
          <TaskDateField
            label="Created"
            :date="task.created_at"
            format="datetime"
          />
        </div>
        <div class="space-y-4">
          <TaskDateField
            v-if="task.due_date"
            label="Due Date"
            :date="task.due_date"
            :is-overdue="isTaskOverdue(task.due_date) && task.status !== 'completed'"
          />
          <TaskDateField
            label="Last Updated"
            :date="task.updated_at"
            format="datetime"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import StatusBadge from '@/components/common/StatusBadge.vue'
import TaskDateField from './TasksFormDateField.vue'
import { isTaskOverdue } from '@/components/utils/utils.js'

defineProps({
  task: {
    type: Object,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle-status'])
</script>
