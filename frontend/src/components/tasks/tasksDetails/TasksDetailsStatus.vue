<template>
  <div>
    <h3 class="text-sm font-medium text-gray-700 mb-2">Current Status</h3>
    <StatusBadge :status="task.status" size="md" />
  </div>
</template>

<script setup>
import StatusBadge from '@/components/common/StatusBadge.vue'

defineProps({
  task: {
    type: Object,
    required: true
  }
})
</script>
