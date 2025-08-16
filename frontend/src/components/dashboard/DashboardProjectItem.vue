<template>
  <div class="p-6 hover:bg-gray-50 transition-colors duration-200">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <div class="flex-shrink-0">
          <div class="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
            <FolderIcon class="h-6 w-6 text-primary-600" />
          </div>
        </div>
        <div>
          <h3 class="text-sm font-medium text-gray-900">
            <router-link
              :to="`/projects/${project.id}`"
              class="hover:text-primary-600 transition-colors"
            >
              {{ project.name }}
            </router-link>
          </h3>
          <p class="text-sm text-gray-500">
            Due {{ formatDate(project.end_date) }} • ${{ formatCurrency(project.value) }}
          </p>
          <p class="text-sm text-gray-500">
            Owner: {{ project.owner?.username }}
          </p>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <span
          :class="[
            'inline-flex px-2 py-1 text-xs font-medium rounded-full',
            project.status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          ]"
        >
          {{ project.status }}
        </span>
        <router-link
          :to="`/projects/${project.id}`"
          class="text-primary-600 hover:text-primary-900"
        >
          <ChevronRightIcon class="h-5 w-5" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { FolderIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import { formatCurrency, formatDate } from '@/components/utils/utils.js'
defineProps({
  project: {
    type: Object,
    required: true
  }
})
</script>
