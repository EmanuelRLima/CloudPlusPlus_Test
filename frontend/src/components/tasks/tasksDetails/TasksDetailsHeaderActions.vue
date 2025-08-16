<template>
  <div class="flex items-center space-x-3">
    <router-link
      :to="`/projects/${projectId}/tasks/${task.id}/edit`"
      class="btn-primary"
    >
      <PencilIcon class="h-5 w-5 mr-2" />
      Edit Task
    </router-link>

    <Menu as="div" class="relative">
      <MenuButton class="btn-secondary p-2">
        <EllipsisVerticalIcon class="h-5 w-5" />
      </MenuButton>
      <MenuItems class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <MenuItem v-slot="{ active }">
          <button
            @click="$emit('toggle-status')"
            :class="[active ? 'bg-gray-50' : '', 'block w-full text-left px-4 py-2 text-sm text-gray-700']"
          >
            Mark as {{ task.status === 'completed' ? 'pending' : 'completed' }}
          </button>
        </MenuItem>
        <MenuItem v-slot="{ active }">
          <button
            @click="$emit('delete-task')"
            :class="[active ? 'bg-gray-50' : '', 'block w-full text-left px-4 py-2 text-sm text-red-600']"
          >
            Delete Task
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  </div>
</template>

<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { PencilIcon, EllipsisVerticalIcon } from '@heroicons/vue/24/outline'

defineProps({
  task: {
    type: Object,
    required: true
  },
  projectId: {
    type: [String, Number],
    required: true
  }
})

defineEmits(['toggle-status', 'delete-task'])
</script>
