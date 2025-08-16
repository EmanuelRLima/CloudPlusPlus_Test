<template>
  <div class="card">
    <div class="card-header">
      <h2 class="text-lg font-medium text-gray-900">Quick Stats</h2>
    </div>
    <div class="card-body">
      <dl class="space-y-4">
        <div class="flex justify-between">
          <dt class="text-sm font-medium text-gray-500">Progress</dt>
          <dd class="text-sm text-gray-900">{{ progressPercentage }}%</dd>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-primary-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${progressPercentage}%` }"
          ></div>
        </div>
        <div class="flex justify-between">
          <dt class="text-sm font-medium text-gray-500">Days Remaining</dt>
          <dd class="text-sm text-gray-900">
            <span :class="daysRemaining < 0 ? 'text-red-600' : 'text-gray-900'">
              {{ Math.abs(daysRemaining) }} {{ daysRemaining < 0 ? 'days overdue' : 'days' }}
            </span>
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script setup>
defineProps({
  progressPercentage: {
    type: Number,
    default: 0
  },
  daysRemaining: {
    type: Number,
    default: 0
  }
})
</script>
