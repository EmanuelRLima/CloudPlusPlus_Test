<template>
  <div>
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <select
      :id="id"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      :required="required"
      :class="selectClasses"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <slot>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </slot>
    </select>
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
  options: {
    type: Array,
    default: () => []
  }
})

defineEmits(['update:modelValue'])

const selectClasses = computed(() => {
  const baseClasses = 'form-select mt-1'
  const errorClasses = props.error ? 'form-input-error' : ''

  return `${baseClasses} ${errorClasses}`.trim()
})
</script>
