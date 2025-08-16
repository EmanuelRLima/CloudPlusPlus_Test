<template>
  <AppLayout>
    <TaskLoadingSkeleton v-if="tasksStore.isLoading" />

    <div v-else-if="tasksStore.currentTask" class="space-y-8">
      <TaskHeader
        :task="task"
        :project-id="projectId"
        :is-project-owner="isProjectOwner(authStore, projectsStore.currentProject)"
        @toggle-status="toggleTaskStatus"
        @delete-task="confirmDelete"
      />

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div class="lg:col-span-2 space-y-8">
          <TaskDetails :task="task" />
          <ProjectInformation
            v-if="projectsStore.currentProject"
            :project="projectsStore.currentProject"
          />
        </div>

        <div class="space-y-8">
          <TaskInfoSidebar :task="task" />

          <QuickActions
            v-if="isProjectOwner(authStore, projectsStore.currentProject)"
            :task="task"
            :project-id="projectId"
            :is-loading="tasksStore.isLoading"
            @toggle-status="toggleTaskStatus"
          />

          <RelatedTasks
            v-if="relatedTasks.length > 0"
            :tasks="relatedTasks"
            :project-id="projectId"
            :is-project-owner="isProjectOwner(authStore, projectsStore.currentProject)"
            @navigate-to-task="navigateToTask"
            @toggle-task-status="toggleRelatedTaskStatus"
          />
        </div>
      </div>
    </div>

    <TaskNotFound
      v-else
      :project-id="projectId"
    />

    <BaseModal
      :show="showDeleteModal"
      title="Delete Task"
      :message="`Are you sure you want to delete '${task?.title}'? This action cannot be undone.`"
      confirm-text="Delete"
      cancel-text="Cancel"
      variant="danger"
      :is-loading="tasksStore.isLoading"
      :icon="ExclamationTriangleIcon"
      @close="showDeleteModal = false"
      @confirm="deleteTask"
    />
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectsStore } from '@/stores/projects'
import { useTasksStore } from '@/stores/tasks'
import { toast } from 'vue3-toastify'
import { useAuthStore } from '@/stores/auth'
import { isProjectOwner } from '@/components/utils/utils.js'

import AppLayout from '@/components/layout/AppLayout.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import TaskLoadingSkeleton from '@/components/common/LoadingSkeleton.vue'
import TaskHeader from '@/components/tasks/tasksDetails/TasksDetailsHeader.vue'
import TaskDetails from '@/components/tasks/tasksDetails/TasksDetails.vue'
import ProjectInformation from '@/components/tasks/tasksDetails/TasksDetailsProjectInformation.vue'
import TaskInfoSidebar from '@/components/tasks/tasksDetails/TasksDetailsInfoSidebar.vue'
import QuickActions from '@/components/tasks/tasksDetails/TasksDetailsQuickActions.vue'
import RelatedTasks from '@/components/tasks/tasksDetails/TasksDetailsRelatedTasks.vue'
import TaskNotFound from '@/components/tasks/tasksDetails/TasksDetailsNotFound.vue'

import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const projectsStore = useProjectsStore()
const tasksStore = useTasksStore()
const authStore = useAuthStore()

const projectId = computed(() => route.params.projectId)
const showDeleteModal = ref(false)
const task = computed(() => tasksStore.currentTask)

const relatedTasks = computed(() => {
  return tasksStore.tasks
    .filter(t => t.id !== task.value?.id)
    .slice(0, 5)
})

onMounted(async () => {
  await loadProject()
  await loadTask()
  await loadAllTasks()
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

async function loadTask() {
  const result = await tasksStore.fetchTask(route.params.taskId)
  if (!result.success) {
    toast.error('Failed to load task')
    router.push(`/projects/${projectId.value}/tasks`)
  }
}

async function loadAllTasks() {
  await tasksStore.fetchTasks(projectId.value)
}

async function toggleTaskStatus() {
  const result = await tasksStore.toggleTaskStatus(task.value.id)
  if (!result.success) {
    toast.error('Failed to update task status')
  } else {
    const result = await tasksStore.fetchTasks(1)
    if (!result.success) {
      toast.error('Failed to refresh tasks')
    }
  }
}

async function toggleRelatedTaskStatus(relatedTask) {
  const result = await tasksStore.toggleTaskStatus(relatedTask.id)
  if (!result.success) {
    toast.error('Failed to update task status')
  } else {
    const result = await tasksStore.fetchTasks(1)
    if (!result.success) {
      toast.error('Failed to refresh tasks')
    }
  }
}

function navigateToTask(taskId) {
  router.push(`/projects/${projectId.value}/tasks/${taskId}`)
}

function confirmDelete() {
  showDeleteModal.value = true
}

async function deleteTask() {
  const result = await tasksStore.deleteTask(task.value.id)
  if (result.success) {
    toast.success('Task deleted successfully')
    router.push(`/projects/${projectId.value}/tasks`)
  } else {
    toast.error(result.error)
  }
}
</script>
