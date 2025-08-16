<template>
  <div class="card">
    <div class="card-header">
      <div class="flex">
        <h2 class="text-lg font-medium text-gray-900 mr-1">Project Details - </h2>
        <StatusBadge :status="project.status" size="md" />
      </div>
    </div>

    <div class="card-body">
      <div class="space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-2">Title</h3>
            <p class="text-gray-900 leading-relaxed">
              {{ project.name || 'No title provided' }}
            </p>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-2">Description</h3>
            <p class="text-gray-900 leading-relaxed">
              {{ project.description || 'No description provided' }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-2">Project Value</h3>
            <p class="text-2xl font-bold text-green-600">
              ${{ formatCurrency(project.value) }}
            </p>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-2">Duration</h3>
            <p class="text-lg font-semibold text-gray-900">
              {{ calculateDuration(project.start_date, project.end_date) }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-2">Start Date</h3>
            <div class="flex items-center space-x-2">
              <CalendarIcon class="h-5 w-5 text-gray-400" />
              <span class="text-gray-900">{{ formatDate(project.start_date) }}</span>
            </div>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-2">End Date</h3>
            <div class="flex items-center space-x-2">
              <CalendarIcon class="h-5 w-5 text-gray-400" />
              <span class="text-gray-900">{{ formatDate(project.end_date) }}</span>
              <StatusBadge
                v-if="isOverdue(project.end_date)"
                status="overdue"
                size="xs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { CalendarIcon } from '@heroicons/vue/24/outline'
import { useFormatters } from '@/composables/useFormatters'
import StatusBadge from '@/components/common/StatusBadge.vue'

defineProps({
  project: {
    type: Object,
    required: true
  }
})

const { formatCurrency, formatDate, calculateDuration, isOverdue } = useFormatters()
</script>
