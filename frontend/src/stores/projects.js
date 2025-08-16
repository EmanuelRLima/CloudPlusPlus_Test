import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref([])
  const currentProject = ref(null)
  const isLoading = ref(false)
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0
  })
  const filters = ref({
    search: '',
    status: '',
    sort_by: 'start_date',
    sort_direction: 'desc'
  })

  const totalProjects = computed(() => pagination.value.total)
  const hasProjects = computed(() => projects.value.length > 0)
  const activeProjects = computed(() => pagination.value.total_active)
  const inactiveProjects = computed(() => pagination.value.total_inactive)

  async function fetchProjects(page = 1) {
    isLoading.value = true

    try {
      const params = {
        page,
        per_page: pagination.value.per_page,
        ...filters.value
      }

      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null) {
          delete params[key]
        }
      })

      const response = await api.get('v1/projects', { params })
      const { data, ...paginationData } = response.data
      projects.value = data
      pagination.value = paginationData.meta

      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch projects'

      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  async function fetchProject(id) {
    isLoading.value = true

    try {
      const response = await api.get(`v1/projects/${id}`)
      currentProject.value = response.data.data

      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch project'

      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  async function createProject(projectData) {
    isLoading.value = true

    try {
      const response = await api.post('v1/projects', projectData)
      const newProject = response.data.data

      if (pagination.value.current_page === 1) {
        projects.value.unshift(newProject)

        if (projects.value.length > pagination.value.per_page) {
          projects.value.pop()
        }
      }

      pagination.value.total += 1


      return { success: true, data: newProject }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create project'

      return {
        success: false,
        errors: error.response?.data?.errors || {},
        message
      }
    } finally {
      isLoading.value = false
    }
  }

  async function updateProject(id, projectData) {
    isLoading.value = true

    try {
      const response = await api.put(`v1/projects/${id}`, projectData)
      const updatedProject = response.data.data

      const index = projects.value.findIndex(p => p.id === id)
      if (index !== -1) {
        projects.value[index] = updatedProject
      }

      if (currentProject.value?.id === id) {
        currentProject.value = updatedProject
      }


      return { success: true, data: updatedProject }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update project'

      return {
        success: false,
        errors: error.response?.data?.errors || {},
        message
      }
    } finally {
      isLoading.value = false
    }
  }

  async function deleteProject(id) {
    isLoading.value = true

    try {
      await api.delete(`v1/projects/${id}`)

      projects.value = projects.value.filter(p => p.id !== id)

      if (currentProject.value?.id === id) {
        currentProject.value = null
      }

      pagination.value.total -= 1


      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete project'

      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  function setFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters }
  }

  function clearFilters() {
    filters.value = {
      search: '',
      status: '',
      sort_by: 'start_date',
      sort_direction: 'desc'
    }
  }

  function setCurrentProject(project) {
    currentProject.value = project
  }

  function clearCurrentProject() {
    currentProject.value = null
  }

  return {
    projects,
    currentProject,
    isLoading,
    pagination,
    filters,

    totalProjects,
    hasProjects,
    activeProjects,
    inactiveProjects,

    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
    setFilters,
    clearFilters,
    setCurrentProject,
    clearCurrentProject
  }
})
