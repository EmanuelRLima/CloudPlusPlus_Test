<template>
  <div>
    <dt class="text-sm font-medium text-gray-500">{{ label }}</dt>
    <dd class="mt-1 text-sm text-gray-900">
      <span :class="dateClasses">
        {{ formattedDate }}
        {{ isOverdue ? '(Overdue)' : '' }}
      </span>
    </dd>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatDate, formatDateTime } from '@/components/utils/utils.js'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  format: {
    type: String,
    default: 'date',
    validator: (value) => ['date', 'datetime'].includes(value)
  },
  isOverdue: {
    type: Boolean,
    default: false
  }
})

const formattedDate = computed(() => {
  return props.format === 'datetime'
    ? formatDateTime(props.date)
    : formatDate(props.date)
})

const dateClasses = computed(() => [
  props.isOverdue ? 'text-red-600 font-medium' : 'text-gray-900'
])
</script>
