<template>
  <div class="space-y-2">
    <div class="flex justify-between text-sm">
      <span class="text-gray-500">Value:</span>
      <span class="font-medium text-gray-900">${{ formatCurrency(project.value) }}</span>
    </div>
    <div class="flex justify-between text-sm">
      <span class="text-gray-500">Start Date:</span>
      <span class="text-gray-700">{{ formatDate(project.start_date) }}</span>
    </div>
    <div class="flex justify-between text-sm">
      <span class="text-gray-500">End Date:</span>
      <span class="text-gray-700">{{ formatDate(project.end_date) }}</span>
    </div>
    <div class="flex justify-between text-sm">
      <span class="text-gray-500">Owner:</span>
      <span class="text-gray-700">{{ project.owner?.username }}</span>
    </div>
  </div>
</template>

<script setup>
import { useFormatters } from '@/composables/useFormatters'

defineProps({
  project: {
    type: Object,
    required: true
  }
})

const { formatCurrency, formatDate } = useFormatters()
</script>
