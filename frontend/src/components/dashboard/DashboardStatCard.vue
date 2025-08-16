<template>
  <div class="card">
    <div class="card-body">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div :class="iconWrapperClasses">
            <component :is="iconComponent" :class="iconClasses" />
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
  FolderIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  icon: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  iconColor: {
    type: String,
    default: 'primary'
  }
})

const iconComponent = computed(() => {
  const icons = {
    FolderIcon,
    CheckCircleIcon,
    ClockIcon,
    CurrencyDollarIcon
  }
  return icons[props.icon]
})

const iconWrapperClasses = computed(() => {
  const colorClasses = {
    primary: 'p-3 bg-primary-100 rounded-lg',
    green: 'p-3 bg-green-100 rounded-lg',
    gray: 'p-3 bg-gray-100 rounded-lg',
    blue: 'p-3 bg-blue-100 rounded-lg'
  }
  return colorClasses[props.iconColor]
})

const iconClasses = computed(() => {
  const colorClasses = {
    primary: 'h-6 w-6 text-primary-600',
    green: 'h-6 w-6 text-green-600',
    gray: 'h-6 w-6 bg-gray-100',
    blue: 'h-6 w-6 text-blue-600'
  }
  return colorClasses[props.iconColor]
})
</script>
