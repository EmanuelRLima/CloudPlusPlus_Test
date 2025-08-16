<template>
  <div class="sm:flex sm:items-center sm:justify-between">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Projects</h1>
      <p class="mt-2 text-sm text-gray-700">
        See projects in one place
      </p>
    </div>
    <div class="mt-4 sm:mt-0">
      <router-link to="/projects/create" class="btn-primary">
        <PlusIcon class="h-5 w-5 mr-2" />
        New Project
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { PlusIcon } from '@heroicons/vue/24/outline'
</script>
