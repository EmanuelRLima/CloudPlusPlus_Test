<template>
  <router-link
    :to="to"
    class="group p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all duration-200"
  >
    <div class="flex items-center">
      <div class="flex-shrink-0">
        <component
          :is="iconComponent"
          class="h-8 w-8 text-primary-600 group-hover:text-primary-700"
        />
      </div>
      <div class="ml-3">
        <p class="text-sm font-medium text-gray-900">{{ title }}</p>
        <p class="text-sm text-gray-500">{{ description }}</p>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
import {
  PlusCircleIcon,
  FolderOpenIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  to: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
})

const iconComponent = computed(() => {
  const icons = {
    PlusCircleIcon,
    FolderOpenIcon
  }
  return icons[props.icon]
})
</script>
