<template>
  <div class="card hover:shadow-md transition-shadow duration-200">
    <div class="card-body">
      <div class="flex items-start justify-between">
        <div class="flex items-start space-x-4 flex-1">
          <div v-if="isOwner" class="flex-shrink-0 pt-1">
            <input
              type="checkbox"
              :checked="task.status === 'completed'"
              @change="$emit('toggle')"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>
          <div class="flex-1 min-w-0">
            <h3
              :class="titleClass"
              @click="$emit('click')"
            >
              {{ task.title }}
            </h3>
            <p
              v-if="task.description"
              :class="descriptionClass"
            >
              {{ task.description }}
            </p>
            <div class="mt-3 flex items-center space-x-4 text-sm text-gray-500">
              <div class="flex items-center space-x-1">
                <CalendarIcon class="h-4 w-4" />
                <span>Created {{ formatDate(task.created_at) }}</span>
              </div>
              <div v-if="task.due_date" class="flex items-center space-x-1">
                <ClockIcon class="h-4 w-4" />
                <span :class="dueDateClass">
                  Due {{ formatDate(task.due_date) }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <StatusBadge :status="task.status" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { CalendarIcon, ClockIcon } from '@heroicons/vue/24/outline'
import StatusBadge from '@/components/common/StatusBadge.vue'

const props = defineProps({
  task: {
    type: Object,
    required: true
  },
  isOwner: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle', 'click'])

const titleClass = computed(() => [
  'text-lg font-medium cursor-pointer hover:text-primary-600 transition-colors',
  props.task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
])

const descriptionClass = computed(() => [
  'mt-1 text-sm line-clamp-2',
  props.task.status === 'completed' ? 'text-gray-400' : 'text-gray-600'
])

const dueDateClass = computed(() => {
  const isOverdue = isTaskOverdue(props.task.due_date) && props.task.status !== 'completed'
  return isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'
})

function isTaskOverdue(dueDate) {
  return new Date(dueDate) < new Date()
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
</script>
