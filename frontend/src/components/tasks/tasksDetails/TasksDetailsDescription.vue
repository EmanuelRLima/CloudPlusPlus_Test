<template>
  <div>
    <h3 class="text-sm font-medium text-gray-700 mb-2">Description</h3>
    <div
      :class="[
        'leading-relaxed',
        task.status === 'completed' ? 'text-gray-500' : 'text-gray-900'
      ]"
    >
      <p v-if="task.description" class="whitespace-pre-wrap">{{ task.description }}</p>
      <p v-else class="text-gray-400 italic">No description provided</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  task: {
    type: Object,
    required: true
  }
})
</script>
