import { reactive, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import { useProjectsStore } from '@/stores/projects'
import { validateProjectForm } from '@/components/utils/validators'

export function useProjectForm() {
  const route = useRoute()
  const router = useRouter()
  const projectsStore = useProjectsStore()

  const isEditing = computed(() => !!route.params.id)
  const isFormReady = ref(false)
  const errors = ref({})

  const form = reactive({
    name: '',
    description: '',
    value: '',
    start_date: '',
    end_date: '',
    status: 'active'
  })

  function setDefaultDates() {
    const today = new Date()
    form.start_date = today.toISOString().split('T')[0]

    const futureDate = new Date(today)
    futureDate.setDate(today.getDate() + 30)
    form.end_date = futureDate.toISOString().split('T')[0]
  }

  function updateForm(field, value) {
    if (form && typeof form === 'object') {
      form[field] = value
      if (errors.value[field]) {
        delete errors.value[field]
      }
    }
  }

  async function loadProject() {
    const result = await projectsStore.fetchProject(route.params.id)
    if (result.success && projectsStore.currentProject) {
      const project = projectsStore.currentProject

      Object.assign(form, {
        name: project.name || '',
        description: project.description || '',
        value: project.value || '',
        start_date: project.start_date || '',
        end_date: project.end_date || '',
        status: project.status || 'active'
      })
    } else {
      toast.error('Failed to load project')
      router.push('/projects')
    }
  }

  async function initializeForm() {
    try {
      if (isEditing.value) {
        await loadProject()
      } else {
        setDefaultDates()
      }
    } catch (error) {
      console.error('Error initializing form:', error)
      toast.error('Failed to initialize form')
    } finally {
      isFormReady.value = true
    }
  }

  async function submitForm() {
    errors.value = {}

    const validation = validateProjectForm(form)
    if (!validation.isValid) {
      errors.value = validation.errors
      toast.error('Please correct the errors below')
      return
    }

    const projectData = {
      name: form.name,
      description: form.description,
      value: parseFloat(form.value) || 0,
      start_date: form.start_date,
      end_date: form.end_date
    }

    if (isEditing.value) {
      projectData.status = form.status
    }

    let result
    if (isEditing.value) {
      result = await projectsStore.updateProject(route.params.id, projectData)
    } else {
      result = await projectsStore.createProject(projectData)
    }

    if (result.success) {
      toast.success(isEditing.value ? 'Project updated successfully' : 'Project created successfully')
      router.push('/projects')
    } else {
      if (result.errors) {
        errors.value = result.errors
      }
      toast.error(result.message || 'An error occurred')
    }
  }

  return {
    form,
    errors,
    isEditing,
    isFormReady,
    updateForm,
    initializeForm,
    submitForm,
    isLoading: computed(() => projectsStore.isLoading)
  }
}
