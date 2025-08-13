<template>
  <div>
    <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-lg bg-primary-600">
      <slot name="icon">
        <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </slot>
    </div>
    <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
      {{ title }}
    </h2>
    <p class="mt-2 text-center text-sm text-gray-600">
      {{ subtitle }}
      <router-link :to="linkTo" class="font-medium text-primary-600 hover:text-primary-500 transition-colors">
        {{ linkText }}
      </router-link>
    </p>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  linkTo: { type: String, required: true },
  linkText: { type: String, required: true }
})
</script>
