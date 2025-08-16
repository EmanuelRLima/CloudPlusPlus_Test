<template>
  <div class="text-center py-8">
    <ClipboardDocumentListIcon class="mx-auto h-12 w-12 text-gray-400" />
    <h3 class="mt-2 text-sm font-medium text-gray-900">No tasks yet</h3>
    <p class="mt-1 text-sm text-gray-500">Get started by creating your first task.</p>
    <div v-if="isOwner" class="mt-6">
      <router-link
        :to="`/projects/${projectId}/tasks/create`"
        class="btn-primary"
      >
        <PlusIcon class="h-4 w-4 mr-2" />
        Create Task
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ClipboardDocumentListIcon, PlusIcon } from '@heroicons/vue/24/outline'

defineProps({
  projectId: {
    type: [String, Number],
    required: true
  },
  isOwner: {
    type: Boolean,
    default: false
  }
})
</script>
