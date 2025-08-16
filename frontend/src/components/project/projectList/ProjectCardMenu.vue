<template>
  <Menu as="div" class="relative">
    <MenuButton class="p-2 text-gray-400 hover:text-gray-600">
      <EllipsisVerticalIcon class="h-5 w-5" />
    </MenuButton>
    <MenuItems class="absolute right-0 z-10 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
      <MenuItem v-slot="{ active }">
        <router-link
          :to="`/projects/${project.id}`"
          :class="[active ? 'bg-gray-50' : '', 'block px-4 py-2 text-sm text-gray-700']"
        >
          View Details
        </router-link>
      </MenuItem>
      <MenuItem v-if="canEdit" v-slot="{ active }">
        <router-link
          :to="`/projects/${project.id}/edit`"
          :class="[active ? 'bg-gray-50' : '', 'block px-4 py-2 text-sm text-gray-700']"
        >
          Edit Project
        </router-link>
      </MenuItem>
      <MenuItem v-if="canEdit" v-slot="{ active }">
        <button
          @click="$emit('delete')"
          :class="[active ? 'bg-gray-50' : '', 'block w-full text-left px-4 py-2 text-sm text-red-600']"
        >
          Delete Project
        </button>
      </MenuItem>
    </MenuItems>
  </Menu>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { isProjectOwner } from '@/components/utils/utils.js'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { EllipsisVerticalIcon } from '@heroicons/vue/24/outline'

const authStore = useAuthStore()

const props = defineProps({
  project: {
    type: Object,
    required: true
  }
})

defineEmits(['delete'])

const canEdit = computed(() => isProjectOwner(authStore, props.project))
</script>
