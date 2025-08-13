<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
  >
    <div v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white">
      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
    {{ loading ? loadingText : text }}
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: { type: String, default: 'button' },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  text: { type: String, required: true },
  loadingText: { type: String, required: true },
  variant: { type: String, default: 'primary' }
})

const buttonClasses = computed(() => [
  'btn-primary w-full justify-center',
  props.disabled ? 'opacity-50 cursor-not-allowed' : ''
])
</script>
