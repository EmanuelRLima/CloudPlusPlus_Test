<template>
  <div class="card">
    <div class="card-body">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div :class="iconBackgroundClass">
            <component :is="iconComponent" :class="iconClass" />
          </div>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-500">{{ title }}</p>
          <p class="text-2xl font-bold text-gray-900">{{ value }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  ClipboardDocumentListIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  icon: {
    type: String,
    required: true,
    validator: (value) => ['total', 'pending', 'completed', 'inactive'].includes(value)
  },
  color: {
    type: String,
    required: true,
    validator: (value) => ['blue', 'yellow', 'green', 'gray'].includes(value)
  }
})

const iconComponent = computed(() => {
  const icons = {
    total: ClipboardDocumentListIcon,
    pending: ClockIcon,
    completed: CheckCircleIcon,
    inactive: XCircleIcon
  }
  return icons[props.icon]
})

const iconBackgroundClass = computed(() => {
  const classes = {
    blue: 'p-3 bg-blue-100 rounded-lg',
    yellow: 'p-3 bg-yellow-100 rounded-lg',
    green: 'p-3 bg-green-100 rounded-lg',
    gray: 'p-3 bg-gray-100 rounded-lg'
  }
  return classes[props.color]
})

const iconClass = computed(() => {
  const classes = {
    blue: 'h-6 w-6 text-blue-600',
    yellow: 'h-6 w-6 text-yellow-600',
    green: 'h-6 w-6 text-green-600',
    gray: 'h-6 w-6 text-gray-600'
  }
  return classes[props.color]
})
</script>
