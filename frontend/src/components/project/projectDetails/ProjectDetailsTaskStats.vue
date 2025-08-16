<template>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
    <div class="bg-blue-50 rounded-lg p-4">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <ClipboardDocumentListIcon class="h-6 w-6 text-blue-600" />
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-blue-800">Total Tasks</p>
          <p class="text-lg font-bold text-blue-900">{{ totalTasks }}</p>
        </div>
      </div>
    </div>

    <div class="bg-yellow-50 rounded-lg p-4">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <ClockIcon class="h-6 w-6 text-yellow-600" />
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-yellow-800">Pending</p>
          <p class="text-lg font-bold text-yellow-900">{{ pendingTasks }}</p>
        </div>
      </div>
    </div>

    <div class="bg-green-50 rounded-lg p-4">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <CheckCircleIcon class="h-6 w-6 text-green-600" />
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-green-800">Completed</p>
          <p class="text-lg font-bold text-green-900">{{ completedTasks }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ClipboardDocumentListIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'

defineProps({
  totalTasks: {
    type: Number,
    required: true
  },
  pendingTasks: {
    type: Number,
    required: true
  },
  completedTasks: {
    type: Number,
    required: true
  }
})
</script>
