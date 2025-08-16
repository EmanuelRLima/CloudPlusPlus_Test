<template>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
    <BaseInput
      id="start_date"
      :model-value="startDate"
      label="Start Date"
      type="date"
      :error="startError"
      required
      @update:model-value="$emit('update:startDate', $event)"
    />

    <BaseInput
      id="end_date"
      :model-value="endDate"
      label="End Date"
      type="date"
      :min="startDate"
      :error="endError"
      required
      @update:model-value="$emit('update:endDate', $event)"
    />
  </div>
</template>

<script setup>
import BaseInput from '@/components/common/BaseInput.vue'

defineProps({
  startDate: {
    type: String,
    default: ''
  },
  endDate: {
    type: String,
    default: ''
  },
  startError: {
    type: [Array, String],
    default: null
  },
  endError: {
    type: [Array, String],
    default: null
  }
})

defineEmits(['update:startDate', 'update:endDate'])
</script>
