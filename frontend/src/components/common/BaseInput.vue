<template>
  <div>
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative mt-1">
      <div v-if="prefix" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span class="text-gray-500 sm:text-sm">{{ prefix }}</span>
      </div>
      <input
        :id="id"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :type="type"
        :placeholder="placeholder"
        :min="min"
        :max="max"
        :step="step"
        :required="required"
        :class="inputClasses"
      />
    </div>
    <p v-if="error" class="mt-1 text-sm text-red-600">
      {{ Array.isArray(error) ? error[0] : error }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  error: {
    type: [Array, String],
    default: null
  },
  required: {
    type: Boolean,
    default: false
  },
  prefix: {
    type: String,
    default: ''
  },
  min: {
    type: [String, Number],
    default: null
  },
  max: {
    type: [String, Number],
    default: null
  },
  step: {
    type: [String, Number],
    default: null
  }
})

defineEmits(['update:modelValue'])

const inputClasses = computed(() => {
  const baseClasses = 'form-input'
  const prefixClasses = props.prefix ? 'pl-7' : ''
  const errorClasses = props.error ? 'form-input-error' : ''

  return `${baseClasses} ${prefixClasses} ${errorClasses}`.trim()
})
</script>
