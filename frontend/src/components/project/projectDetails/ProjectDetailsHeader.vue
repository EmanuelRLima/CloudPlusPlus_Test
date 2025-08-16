<template>
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
    <div class="flex items-center space-x-4">
      <router-link to="/projects" class="btn-secondary">
        <ArrowLeftIcon class="h-5 w-5 mr-2" />
        Back to Projects
      </router-link>
    </div>

    <div v-if="isOwner" class="flex items-center space-x-3">
      <router-link
        :to="`/projects/${project.id}/edit`"
        class="btn-primary"
      >
        <PencilIcon class="h-5 w-5 mr-2" />
        Edit Project
      </router-link>

      <Menu as="div" class="relative">
        <MenuButton class="btn-secondary p-2">
          <EllipsisVerticalIcon class="h-5 w-5" />
        </MenuButton>
        <MenuItems class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <MenuItem v-slot="{ active }">
            <button
              @click="$emit('delete-project')"
              :class="[active ? 'bg-gray-50' : '', 'block w-full text-left px-4 py-2 text-sm text-red-600']"
            >
              Delete Project
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  </div>
</template>

<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ArrowLeftIcon, PencilIcon, EllipsisVerticalIcon } from '@heroicons/vue/24/outline'

defineProps({
  project: {
    type: Object,
    required: true
  },
  isOwner: {
    type: Boolean,
    default: false
  }
})

defineEmits(['delete-project'])
</script>
