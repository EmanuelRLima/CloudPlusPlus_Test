<template>
  <div class="sm:flex sm:items-center sm:justify-between">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p class="mt-2 text-sm text-gray-700">
        Welcome back, {{ user?.username }}! Here's an overview of projects.
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  user: {
    type: Object,
    default: null
  }
})
</script>
