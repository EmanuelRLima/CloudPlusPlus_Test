<template>
  <span v-if="safeStatus" :class="classes">
    {{ label }}
  </span>
  <span v-else class="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-500">
    No Status
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    default: null
  },
  size: {
    type: String,
    default: 'sm',
    validator: (value) => ['xs', 'sm', 'md'].includes(value)
  }
})

const safeStatus = computed(() => {
  return props.status && typeof props.status === 'string' && props.status.trim() !== ''
})

const classes = computed(() => {
  if (!safeStatus.value) return ''

  const baseClasses = 'inline-flex font-medium rounded-full'

  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm'
  }

  const variants = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    'in progress': 'bg-blue-100 text-blue-800',
    overdue: 'bg-red-100 text-red-800'
  }

  const statusKey = props.status.toLowerCase()
  return `${baseClasses} ${sizeClasses[props.size]} ${variants[statusKey] || variants.inactive}`
})

const label = computed(() => {
  if (!safeStatus.value) return ''
  return props.status.charAt(0).toUpperCase() + props.status.slice(1)
})
</script>
