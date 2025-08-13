<template>
  <AppLayout>
    <div class="space-y-8">

      <div class="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p class="mt-2 text-sm text-gray-700">
            Welcome back, {{ authStore.user?.name }}! Here's what's happening with your projects.
          </p>
        </div>
        <div class="mt-4 sm:mt-0">
          <router-link to="/projects/create" class="btn-primary">
            <PlusIcon class="h-5 w-5 mr-2" />
            New Project
          </router-link>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div class="card">
          <div class="card-body">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="p-3 bg-primary-100 rounded-lg">
                  <FolderIcon class="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Total Projects</p>
                <p class="text-2xl font-bold text-gray-900">{{ stats.totalProjects }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="p-3 bg-green-100 rounded-lg">
                  <CheckCircleIcon class="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Active Projects</p>
                <p class="text-2xl font-bold text-gray-900">{{ stats.activeProjects }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="p-3 bg-yellow-100 rounded-lg">
                  <ClockIcon class="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Pending Tasks</p>
                <p class="text-2xl font-bold text-gray-900">{{ stats.pendingTasks }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="p-3 bg-blue-100 rounded-lg">
                  <CurrencyDollarIcon class="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Total Value</p>
                <p class="text-2xl font-bold text-gray-900">${{ formatCurrency(stats.totalValue) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="text-lg font-medium text-gray-900">Quick Actions</h2>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <router-link
              to="/projects/create"
              class="group p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all duration-200"
            >
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <PlusCircleIcon class="h-8 w-8 text-primary-600 group-hover:text-primary-700" />
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">Create Project</p>
                  <p class="text-sm text-gray-500">Start a new project</p>
                </div>
              </div>
            </router-link>

            <router-link
              to="/projects"
              class="group p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all duration-200"
            >
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <FolderOpenIcon class="h-8 w-8 text-primary-600 group-hover:text-primary-700" />
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">View All Projects</p>
                  <p class="text-sm text-gray-500">Manage your projects</p>
                </div>
              </div>
            </router-link>

            <router-link
              to="/profile"
              class="group p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all duration-200"
            >
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <UserIcon class="h-8 w-8 text-primary-600 group-hover:text-primary-700" />
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">Edit Profile</p>
                  <p class="text-sm text-gray-500">Update your information</p>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Recent Projects -->
      <div class="card">
        <div class="card-header">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-medium text-gray-900">Recent Projects</h2>
            <router-link to="/projects" class="text-sm text-primary-600 hover:text-primary-500">
              View all
            </router-link>
          </div>
        </div>
        <div class="card-body p-0">
          <div v-if="projectsStore.isLoading" class="p-6">
            <div class="animate-pulse space-y-4">
              <div v-for="i in 3" :key="i" class="flex items-center space-x-4">
                <div class="rounded-lg bg-gray-200 h-12 w-12"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="recentProjects.length === 0" class="p-6 text-center">
            <FolderIcon class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900">No projects</h3>
            <p class="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
            <div class="mt-6">
              <router-link to="/projects/create" class="btn-primary">
                <PlusIcon class="h-4 w-4 mr-2" />
                New Project
              </router-link>
            </div>
          </div>

          <div v-else class="divide-y divide-gray-200">
            <div
              v-for="project in recentProjects"
              :key="project.id"
              class="p-6 hover:bg-gray-50 transition-colors duration-200"
            >
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
                  </div>
                </div>
                <div class="flex items-center space-x-4">
                  <span
                    :class="[
                      'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                      project.status === 'Active'
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
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useProjectsStore } from '@/stores/projects'
import AppLayout from '@/components/layout/AppLayout.vue'
import {
  PlusIcon,
  FolderIcon,
  FolderOpenIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserIcon,
  PlusCircleIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const projectsStore = useProjectsStore()

const stats = ref({
  totalProjects: 0,
  activeProjects: 0,
  pendingTasks: 0,
  totalValue: 0
})

const recentProjects = computed(() =>
  projectsStore.projects.slice(0, 5)
)

onMounted(async () => {
  await loadDashboardData()
})

async function loadDashboardData() {
  await projectsStore.fetchProjects()

  stats.value = {
    totalProjects: projectsStore.totalProjects,
    activeProjects: projectsStore.activeProjects.length,
    pendingTasks: 0,
    totalValue: projectsStore.projects.reduce((sum, project) => sum + parseFloat(project.value || 0), 0)
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
</script>
