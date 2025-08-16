<template>
  <div>

    <div v-if="isLoading" class="space-y-4">
      <LoadingSkeleton v-for="i in 5" :key="i" />
    </div>

    <TasksEmptyState
      v-else-if="tasks.length === 0"
      :has-filters="hasFilters"
      :is-owner="isOwner"
      :project-id="projectId"
      @clear-filters="$emit('clearFilters')"
    />

    <div v-else class="space-y-4">
      <TaskItem
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        :is-owner="isOwner"
        @toggle="$emit('taskToggle', task)"
        @click="$emit('taskClick', task.id)"
      />
    </div>
  </div>
</template>

<script setup>
import TaskItem from './TasksItem.vue'
import LoadingSkeleton from '@/components/common/LoadingSkeleton.vue'
import TasksEmptyState from './TasksEmptyState.vue'

defineProps({
  tasks: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  hasFilters: {
    type: Boolean,
    default: false
  },
  isOwner: {
    type: Boolean,
    default: false
  },
  projectId: {
    type: String,
    required: true
  }
})

defineEmits(['taskToggle', 'taskClick', 'clearFilters'])
</script>
