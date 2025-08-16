<template>
  <AppLayout>
    <div class="space-y-8">
      <ProjectsHeader />

      <ProjectsFilters
        :filters="filters"
        @update:filters="filters = $event"
        @search="handleSearch"
        @filter="handleFilter"
      />

      <ProjectsLoadingGrid v-if="projectsStore.isLoading" />

      <ProjectsEmptyState
        v-else-if="projectsStore.projects.length === 0"
        :has-filters="hasFilters"
        @clear-filters="clearFilters"
      />

      <ProjectsGrid
        v-else
        :projects="projectsStore.projects"
        @delete="confirmDelete"
      />

      <ProjectsPagination
        v-if="projectsStore.pagination.last_page > 1"
        :pagination="projectsStore.pagination"
        @previous="previousPage"
        @next="nextPage"
        @go-to-page="goToPage"
      />
    </div>

    <BaseModal
      :show="showDeleteModal"
      title="Delete Project"
      :message="`Are you sure you want to delete '${projectToDelete?.name}'? This action cannot be undone.`"
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
import { onMounted } from 'vue'
import { useProjectsStore } from '@/stores/projects'
import { useProjectFilters } from '@/composables/useProjectFilters'
import { useProjectActions } from '@/composables/useProjectActions'
import { usePagination } from '@/composables/usePagination'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

import AppLayout from '@/components/layout/AppLayout.vue'
import ProjectsHeader from '@/components/project/projectList/ProjectHeader.vue'
import ProjectsFilters from '@/components/project/projectList/ProjectFilters.vue'
import ProjectsLoadingGrid from '@/components/project/projectList/ProjectLoadingGrid.vue'
import ProjectsEmptyState from '@/components/project/projectList/ProjectEmptyState.vue'
import ProjectsGrid from '@/components/project/projectList/ProjectGrid.vue'
import ProjectsPagination from '@/components/project/projectList/ProjectPagination.vue'
import BaseModal from '@/components/common/BaseModal.vue'

const projectsStore = useProjectsStore()

const { filters, hasFilters, handleSearch, handleFilter, clearFilters } = useProjectFilters(projectsStore)
const { showDeleteModal, projectToDelete, isLoading, confirmDelete, deleteProject } = useProjectActions(projectsStore)
const { loadProjects, previousPage, nextPage, goToPage } = usePagination(projectsStore)

onMounted(() => loadProjects())
</script>
