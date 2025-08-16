<template>
  <div class="card">
    <div class="card-body text-center py-12">
      <ClipboardDocumentListIcon class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
      <p class="mt-1 text-sm text-gray-500">
        {{ emptyMessage }}
      </p>
      <div class="mt-6">
        <router-link
          v-if="!hasFilters && isOwner"
          :to="`/projects/${projectId}/tasks/create`"
          class="btn-primary"
        >
          <PlusIcon class="h-4 w-4 mr-2" />
          New Task
        </router-link>
        <button
          v-else-if="hasFilters"
          @click="$emit('clearFilters')"
          class="btn-secondary"
        >
          Clear Filters
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ClipboardDocumentListIcon, PlusIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  hasFilters: {
    type: Boolean,
    default: false
  },
  isOwner: {
    type: Boolean,
    default: false
  },
  projectId: {
    type: String,
    required: true
  }
})

defineEmits(['clearFilters'])

const emptyMessage = computed(() => {
  return props.hasFilters
    ? 'Try adjusting your filters'
    : 'Get started by creating your first task'
})
</script>
