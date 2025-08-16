<template>
  <div class="min-h-screen bg-gray-50">

    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog as="div" class="relative z-50 lg:hidden" @close="sidebarOpen = false">
        <TransitionChild
          as="template"
          enter="transition-opacity ease-linear duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-900/80" />
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild
            as="template"
            enter="transition ease-in-out duration-300 transform"
            enter-from="-translate-x-full"
            enter-to="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leave-from="translate-x-0"
            leave-to="-translate-x-full"
          >
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <TransitionChild
                as="template"
                enter="ease-in-out duration-300"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="ease-in-out duration-300"
                leave-from="opacity-100"
                leave-to="opacity-0"
              >
                <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button type="button" class="-m-2.5 p-2.5" @click="sidebarOpen = false">
                    <span class="sr-only">Close sidebar</span>
                    <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>
              <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                <div class="flex h-16 shrink-0 items-center">
                  <div class="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                    <span class="text-white font-bold text-sm">PM</span>
                  </div>
                  <span class="ml-2 text-xl font-bold text-gray-900">Project Manager</span>
                </div>
                <nav class="flex flex-1 flex-col">
                  <ul role="list" class="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" class="-mx-2 space-y-1">
                        <li v-for="item in navigation" :key="item.name">
                          <router-link
                            :to="item.href"
                            :class="[
                              $route.path === item.href
                                ? 'bg-gray-50 text-primary-600'
                                : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50',
                              'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors'
                            ]"
                          >
                            <component
                              :is="item.icon"
                              :class="[
                                $route.path === item.href ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-600',
                                'h-6 w-6 shrink-0'
                              ]"
                              aria-hidden="true"
                            />
                            {{ item.name }}
                          </router-link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
        <div class="flex h-16 shrink-0 items-center">
          <div class="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">PM</span>
          </div>
          <span class="ml-2 text-xl font-bold text-gray-900">Project Manager</span>
        </div>
        <nav class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                <li v-for="item in navigation" :key="item.name">
                  <router-link
                    :to="item.href"
                    :class="[
                      $route.path === item.href
                        ? 'bg-gray-50 text-primary-600'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50',
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors'
                    ]"
                  >
                    <component
                      :is="item.icon"
                      :class="[
                        $route.path === item.href ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-600',
                        'h-6 w-6 shrink-0'
                      ]"
                      aria-hidden="true"
                    />
                    {{ item.name }}
                  </router-link>
                </li>
              </ul>
            </li>
            <li class="-mx-6 mt-auto">
              <div class="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50">
                <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span class="text-sm font-medium text-gray-600">
                    {{ authStore.user?.username?.charAt(0).toUpperCase() }}
                  </span>
                </div>
                <span class="sr-only">Your profile</span>
                <span aria-hidden="true">{{ authStore.user?.username }}</span>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div class="lg:pl-72">
      <div class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        <button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden" @click="sidebarOpen = true">
          <span class="sr-only">Open sidebar</span>
          <Bars3Icon class="h-6 w-6" aria-hidden="true" />
        </button>

        <div class="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

        <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <div class="relative flex flex-1"></div>
          <div class="flex items-center gap-x-4 lg:gap-x-6">

            <button type="button" class="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
              <span class="sr-only">View notifications</span>
              <BellIcon class="h-6 w-6" aria-hidden="true" />
            </button>

            <div class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

            <Menu as="div" class="relative">
              <MenuButton class="-m-1.5 flex items-center p-1.5">
                <span class="sr-only">Open user menu</span>
                <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span class="text-sm font-medium text-gray-600">
                    {{ authStore.user?.username?.charAt(0).toUpperCase() }}
                  </span>
                </div>
                <span class="hidden lg:flex lg:items-center">
                  <span class="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                    {{ authStore.user?.username }}
                  </span>
                  <ChevronDownIcon class="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </MenuButton>
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems class="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                  <MenuItem v-slot="{ active }">
                    <router-link
                      to="/profile"
                      :class="[active ? 'bg-gray-50' : '', 'block px-3 py-1 text-sm leading-6 text-gray-900']"
                    >
                      Your profile
                    </router-link>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <button
                      @click="handleSignOut"
                      :class="[active ? 'bg-gray-50' : '', 'block w-full text-left px-3 py-1 text-sm leading-6 text-gray-900']"
                    >
                      Sign out
                    </button>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>

      <main class="py-10">
        <div class="px-4 sm:px-6 lg:px-8">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Dialog, DialogPanel, Menu, MenuButton, MenuItem, MenuItems, TransitionChild, TransitionRoot } from '@headlessui/vue'
import {
  Bars3Icon,
  BellIcon,
  ChevronDownIcon,
  HomeIcon,
  FolderIcon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()
const sidebarOpen = ref(false)

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Projects', href: '/projects', icon: FolderIcon },
  { name: 'Profile', href: '/profile', icon: UserIcon },
]

async function handleSignOut() {
  await authStore.logout()
  router.push('/login')
}
</script>
