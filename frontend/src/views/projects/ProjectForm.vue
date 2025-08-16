<template>
  <AppLayout>
    <div class="max-w-3xl mx-auto space-y-8">
      <ProjectFormHeader :is-editing="isEditing" />

      <ProjectFormCard
        :form="form"
        :errors="errors"
        :is-editing="isEditing"
        :is-loading="isLoading"
        :is-form-ready="isFormReady"
        @submit="submitForm"
        @update-form="updateForm"
      />

      <ProjectOverview
        v-if="isEditing && projectsStore.currentProject"
        :project="projectsStore.currentProject"
      />
    </div>
  </AppLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import { useProjectsStore } from '@/stores/projects'
import { useProjectForm } from '@/composables/useProjectForm'

import AppLayout from '@/components/layout/AppLayout.vue'
import ProjectFormHeader from '@/components/project/projectForm/ProjectFormHeader.vue'
import ProjectFormCard from '@/components/project/projectForm/ProjectFormCard.vue'
import ProjectOverview from '@/components/project/projectForm/ProjectOverview.vue'

const projectsStore = useProjectsStore()

const {
  form,
  errors,
  isEditing,
  isFormReady,
  isLoading,
  updateForm,
  initializeForm,
  submitForm
} = useProjectForm()

onMounted(initializeForm)
</script>
