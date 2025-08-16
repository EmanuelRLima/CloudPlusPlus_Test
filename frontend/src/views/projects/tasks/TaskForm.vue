<template>
  <AppLayout>
    <div class="max-w-3xl mx-auto space-y-8">
      <TaskFormHeader
        :is-editing="isEditing"
        :project-name="projectsStore.currentProject?.name"
        :project-id="projectId"
      />

      <TaskFormCard
        :form="form"
        :errors="errors"
        :is-loading="tasksStore.isLoading"
        :is-editing="isEditing"
        :project-id="projectId"
        @submit="handleSubmit"
        @update:form="updateForm"
      />

      <TaskPreviewCard
        v-if="isEditing && tasksStore.currentTask"
        :task="tasksStore.currentTask"
        :is-loading="tasksStore.isLoading"
        @toggle-status="toggleTaskStatus"
      />
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectsStore } from '@/stores/projects'
import { useTasksStore } from '@/stores/tasks'
import { toast } from 'vue3-toastify'
import AppLayout from '@/components/layout/AppLayout.vue'
import TaskFormHeader from '@/components/tasks/tasksForm/TasksFormHeader.vue'
import TaskFormCard from '@/components/tasks/tasksForm/TasksFormCard.vue'
import TaskPreviewCard from '@/components/tasks/tasksForm/TasksFormPreviewCard.vue'

const route = useRoute()
const router = useRouter()
const projectsStore = useProjectsStore()
const tasksStore = useTasksStore()

const projectId = computed(() => route.params.projectId)
const isEditing = computed(() => !!route.params.taskId)

const form = reactive({
  title: '',
  description: '',
  due_date: '',
  status: 'pending'
})

const errors = ref({})

onMounted(async () => {
  await loadProject()
  if (isEditing.value) {
    await loadTask()
  }
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
  if (result.success && tasksStore.currentTask) {
    const task = tasksStore.currentTask
    form.title = task.title
    form.description = task.description || ''
    form.due_date = task.due_date || ''
    form.status = task.status
  } else {
    toast.error('Failed to load task')
    router.push(`/projects/${projectId.value}/tasks`)
  }
}

async function handleSubmit() {
  errors.value = {}

  const taskData = {
    title: form.title,
    description: form.description,
    due_date: form.due_date,
    status: form.status
  }

  if (isEditing.value) {
    taskData.status = form.status
  }

  let result
  if (isEditing.value) {
    result = await tasksStore.updateTask(route.params.taskId, taskData)
  } else {
    result = await tasksStore.createTask(projectId.value, taskData)
  }

  if (result.success) {
    toast.success(isEditing.value ? 'Task updated successfully' : 'Task created successfully')
    router.push(`/projects/${projectId.value}/tasks`)
  } else {
    if (result.errors) {
      errors.value = result.errors
    }
    toast.error(result.message)
  }
}

async function toggleTaskStatus() {
  if (tasksStore.currentTask) {
    const result = await tasksStore.toggleTaskStatus(tasksStore.currentTask.id)
    if (result.success) {
      form.status = tasksStore.currentTask.status
    } else {
      toast.error('Failed to update task status')
    }
  }
}

function updateForm(newForm) {
  Object.assign(form, newForm)
}
</script>
