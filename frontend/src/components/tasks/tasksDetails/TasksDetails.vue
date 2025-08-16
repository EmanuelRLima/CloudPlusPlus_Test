<template>
  <div class="card">
    <div class="card-header">
      <h2 class="text-lg font-medium text-gray-900">Task Details</h2>
    </div>
    <div class="card-body">
      <div class="space-y-6">
        <TaskDescription :task="task" />
        <TaskDueDate v-if="task.due_date" :task="task" />

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <TaskStatus :task="task" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TaskDescription from './TasksDetailsDescription.vue'
import TaskDueDate from './TasksDetailsDueDate.vue'
import TaskStatus from './TasksDetailsStatus.vue'

defineProps({
  task: {
    type: Object,
    required: true
  }
})
</script>
