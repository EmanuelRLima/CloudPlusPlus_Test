<template>
  <AppLayout>
    <ProjectLoadingSkeleton v-if="projectsStore.isLoading" />

    <div v-else-if="project" class="space-y-8">
      <ProjectHeader
        :project="project"
        :is-owner="canEdit"
        @delete-project="confirmDelete(project)"
      />

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-8">
          <ProjectDetailsCard :project="project" />
          <ProjectTasksOverview
            :project="project"
            :tasks="recentTasks"
            :is-owner="canEdit"
            :progress-percentage="progressPercentage"
            @toggle-task="toggleTaskStatus"
          />
        </div>

        <div class="space-y-8">
          <ProjectQuickStats
            :progress-percentage="progressPercentage"
            :days-remaining="daysRemaining"
          />
        </div>
      </div>
    </div>

    <ProjectNotFound v-else />

    <BaseModal
      :show="showDeleteModal"
      title="Delete Project"
      :message="`Are you sure you want to delete '${project?.name}'? This action cannot be undone and will also delete all associated tasks.`"
      confirm-text="Delete"
      variant="danger"
      :is-loading="isLoading"
      :icon="ExclamationTriangleIcon"
      @close="showDeleteModal = false"
      @confirm="deleteProject"
    />

  </AppLayout>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useProjectsStore } from '@/stores/projects'
import { useTasksStore } from '@/stores/tasks'
import { useProjectActions } from '@/composables/useProjectActions'
import { useTaskActions } from '@/composables/useTaskActions'
import { useFormatters } from '@/composables/useFormatters'
import { isProjectOwner } from '@/components/utils/utils.js'
import { toast } from 'vue3-toastify'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

import AppLayout from '@/components/layout/AppLayout.vue'
import ProjectLoadingSkeleton from '@/components/common/LoadingSkeleton.vue'
import ProjectHeader from '@/components/project/projectDetails/ProjectDetailsHeader.vue'
import ProjectDetailsCard from '@/components/project/projectDetails/ProjectDetailsCard.vue'
import ProjectTasksOverview from '@/components/project/projectDetails/ProjectDetailsTaskOverview.vue'
import ProjectQuickStats from '@/components/project/projectDetails/ProjectDetailsQuickStats.vue'
import ProjectNotFound from '@/components/project/projectDetails/ProjectDetailsNotFound.vue'
import BaseModal from '@/components/common/BaseModal.vue'

const route = useRoute()
const authStore = useAuthStore()
const projectsStore = useProjectsStore()
const tasksStore = useTasksStore()

const { showDeleteModal, isLoading, confirmDelete, deleteProject } = useProjectActions(projectsStore)

const { toggleTaskStatus, loadTasks } = useTaskActions(tasksStore)
const { calculateDaysRemaining } = useFormatters()

const project = computed(() => projectsStore.currentProject)
const recentTasks = computed(() => tasksStore.tasks.slice(0, 5))
const canEdit = computed(() => isProjectOwner(authStore, project.value))

const progressPercentage = computed(() => {
  if (tasksStore.totalTasks === 0) return 0
  return Math.round((tasksStore.completedTasks / tasksStore.totalTasks) * 100)
})

const daysRemaining = computed(() => {
  if (!project.value) return 0
  return calculateDaysRemaining(project.value.end_date)
})

onMounted(async () => {
  await loadProject()
  await loadTasks(route.params.id)
})

async function loadProject() {
  const result = await projectsStore.fetchProject(route.params.id)
  if (!result.success) {
    toast.error('Failed to load project')
  }
}
</script>
