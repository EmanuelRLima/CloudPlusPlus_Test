<template>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
    <TasksStatCard
      title="Total Tasks"
      :value="stats.total"
      icon="total"
      color="blue"
    />
    <TasksStatCard
      title="Pending"
      :value="stats.pending"
      icon="pending"
      color="yellow"
    />
    <TasksStatCard
      title="Completed"
      :value="stats.completed"
      icon="completed"
      color="green"
    />
    <TasksStatCard
      title="Inactive"
      :value="stats.inactive"
      icon="inactive"
      color="gray"
    />
  </div>
</template>

<script setup>
import TasksStatCard from './TasksStatCard.vue'

defineProps({
  stats: {
    type: Object,
    required: true,
    validator: (value) => {
      return ['total', 'pending', 'completed', 'inactive'].every(key =>
        typeof value[key] === 'number'
      )
    }
  }
})
</script>
