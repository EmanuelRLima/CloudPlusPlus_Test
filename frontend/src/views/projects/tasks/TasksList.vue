<template>
  <AppLayout>
    <div class="space-y-8">

      <TasksHeader
        :project-id="projectId"
        :project-name="projectsStore.currentProject?.name || 'this project'"
        :is-owner="isProjectOwner(authStore, projectsStore.currentProject)"
      />

      <TasksStats :stats="tasksStats" />

      <TasksFilters
        :filters="filters"
        @update:filters="filters = $event"
        @filter-change="handleFilter"
        @search="handleSearch"
      />

      <TasksList
        :tasks="tasksStore.tasks"
        :is-loading="tasksStore.isLoading"
        :has-filters="hasFilters"
        :is-owner="isProjectOwner(authStore, projectsStore.currentProject)"
        :project-id="projectId"
        @task-toggle="toggleTaskStatus"
        @task-click="navigateToTask"
        @clear-filters="clearFilters"
      />

      <TasksPagination
        v-if="tasksStore.pagination.last_page > 1"
        :pagination="tasksStore.pagination"
        @page-change="goToPage"
        @previous="previousPage"
        @next="nextPage"
      />
    </div>

    <TasksDeleteModal
      :show="showDeleteModal"
      @update:show="showDeleteModal = $event"
      :task="taskToDelete"
      :is-loading="tasksStore.isLoading"
      @confirm="deleteTask"
    />
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectsStore } from '@/stores/projects'
import { useTasksStore } from '@/stores/tasks'
import { useAuthStore } from '@/stores/auth'
import { useTaskFilters } from '@/composables/useTaskFilters'
import { useTaskActions } from '@/composables/useTaskActions'
import { toast } from 'vue3-toastify'
import { isProjectOwner } from '@/components/utils/utils.js'

import AppLayout from '@/components/layout/AppLayout.vue'
import TasksHeader from '@/components/tasks/tasksList/TasksHeader.vue'
import TasksStats from '@/components/tasks/tasksList/TasksStats.vue'
import TasksFilters from '@/components/tasks/tasksList/TasksFilters.vue'
import TasksList from '@/components/tasks/tasksList/TasksList.vue'
import TasksPagination from '@/components/tasks/tasksList/TasksPagination.vue'
import TasksDeleteModal from '@/components/tasks/tasksList/TasksDeleteModal.vue'

const route = useRoute()
const router = useRouter()
const projectsStore = useProjectsStore()
const tasksStore = useTasksStore()
const authStore = useAuthStore()

const projectId = computed(() => route.params.projectId)

const { filters, hasFilters, handleSearch, handleFilter, clearFilters } = useTaskFilters(tasksStore, projectId)
const { toggleTaskStatus, loadTasks } = useTaskActions(tasksStore)

const showDeleteModal = ref(false)
const taskToDelete = ref(null)

const tasksStats = computed(() => ({
  total: tasksStore.totalTasks,
  pending: tasksStore.pendingTasks,
  completed: tasksStore.completedTasks,
  inactive: tasksStore.inactiveTasks
}))

onMounted(async () => {
  await loadProject()
  await loadTasks(projectId.value)
})

async function loadProject() {
  if (!projectsStore.currentProject || projectsStore.currentProject.id !== parseInt(projectId.value)) {
    const result = await projectsStore.fetchProject(projectId.value)
    if (!result.success) {
      toast.error('Failed to load project')
      router.push('/projects')
    }
  }
}

function navigateToTask(taskId) {
  router.push(`/projects/${projectId.value}/tasks/${taskId}`)
}

async function deleteTask() {
  const result = await tasksStore.deleteTask(taskToDelete.value.id)
  if (result.success) {
    toast.success('Task deleted successfully')
    showDeleteModal.value = false
    taskToDelete.value = null
  } else {
    toast.error(result.error)
  }
}

async function previousPage() {
  await tasksStore.fetchTasks(projectId.value, tasksStore.pagination.current_page - 1)
}

async function nextPage() {
  await tasksStore.fetchTasks(projectId.value, tasksStore.pagination.current_page + 1)
}

async function goToPage(page) {
  if (typeof page === 'number') {
    await tasksStore.fetchTasks(projectId.value, page)
  }
}
</script>
