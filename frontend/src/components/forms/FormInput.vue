<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <div class="mt-1 relative">
      <input
        :id="id"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :type="inputType"
        :autocomplete="autocomplete"
        :required="required"
        :placeholder="placeholder"
        :class="inputClasses"
      />

      <button
        v-if="type === 'password'"
        type="button"
        class="absolute inset-y-0 right-0 pr-3 flex items-center"
        @click="togglePassword"
      >
        <EyeIcon v-if="!showPassword" class="h-5 w-5 text-gray-400" />
        <EyeSlashIcon v-else class="h-5 w-5 text-gray-400" />
      </button>

      <p v-if="error" class="mt-1 text-sm text-red-600">
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  modelValue: { type: String, required: true },
  type: { type: String, default: 'text' },
  autocomplete: { type: String, default: '' },
  required: { type: Boolean, default: false },
  placeholder: { type: String, default: '' },
  error: { type: String, default: '' }
})


const showPassword = ref(false)

const inputType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})

const inputClasses = computed(() => [
  'form-input',
  props.type === 'password' ? 'pr-10' : '',
  props.error ? 'form-input-error' : ''
])

const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>
