<template>
  <div>
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <textarea
      :id="id"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :rows="rows"
      :placeholder="placeholder"
      :required="required"
      :class="textareaClasses"
    ></textarea>
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
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
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
  rows: {
    type: Number,
    default: 4
  }
})

defineEmits(['update:modelValue'])

const textareaClasses = computed(() => {
  const baseClasses = 'form-input mt-1 w-full'
  const errorClasses = props.error ? 'form-input-error' : ''

  return `${baseClasses} ${errorClasses}`.trim()
})
</script>
