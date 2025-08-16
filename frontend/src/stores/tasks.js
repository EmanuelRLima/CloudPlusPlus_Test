import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref([])
  const currentTask = ref(null)
  const isLoading = ref(false)
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0
  })

  const filters = ref({
    search: '',
    status: '',
    sort_by: 'due_date',
    sort_direction: 'desc'
  })

  const totalTasks = computed(() => pagination.value.total)
  const hasTasks = computed(() => tasks.value.length > 0)
  const pendingTasks = computed(() => pagination.value.total_pending)
  const completedTasks = computed(() => pagination.value.total_completed)
  const inactiveTasks = computed(() => pagination.value.total_inactive)

  function updateFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters }
  }

  async function fetchTasks(projectId, page = 1) {
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

      const response = await api.get(`v1/projects/${projectId}/tasks`, { params })
      const { data, ...paginationData } = response.data

      tasks.value = data
      pagination.value = paginationData.meta

      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch tasks'

      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  async function fetchTask(id) {
    isLoading.value = true

    try {
      const response = await api.get(`v1/tasks/${id}`)
      currentTask.value = response.data.data

      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch task'

      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  async function createTask(projectId, taskData) {
    isLoading.value = true

    try {
      const response = await api.post(`v1/projects/${projectId}/tasks`, taskData)
      const newTask = response.data.data

      if (pagination.value.current_page === 1) {
        tasks.value.unshift(newTask)

        if (tasks.value.length > pagination.value.per_page) {
          tasks.value.pop()
        }
      }

      pagination.value.total += 1


      return { success: true, data: newTask }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create task'

      return {
        success: false,
        errors: error.response?.data?.errors || {},
        message
      }
    } finally {
      isLoading.value = false
    }
  }

  async function updateTask(id, taskData) {
    isLoading.value = true

    try {
      const response = await api.put(`v1/tasks/${id}`, taskData)
      const updatedTask = response.data.data

      const index = tasks.value.findIndex(t => t.id === id)
      if (index !== -1) {
        tasks.value[index] = updatedTask
      }

      if (currentTask.value?.id === id) {
        currentTask.value = updatedTask
      }


      return { success: true, data: updatedTask }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update task'

      return {
        success: false,
        errors: error.response?.data?.errors || {},
        message
      }
    } finally {
      isLoading.value = false
    }
  }

  async function deleteTask(id) {
    isLoading.value = true

    try {
      await api.delete(`v1/tasks/${id}`)

      tasks.value = tasks.value.filter(t => t.id !== id)

      if (currentTask.value?.id === id) {
        currentTask.value = null
      }

      pagination.value.total -= 1


      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete task'

      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  async function toggleTaskStatus(id) {
    const task = tasks.value.find(t => t.id === id)
    if (!task) return { success: false, error: 'Task not found' }

    const newStatus = task.status === 'completed' ? 'pending' : 'completed'

    return await updateTask(id, { status: newStatus })
  }

  function setCurrentTask(task) {
    currentTask.value = task
  }

  function clearCurrentTask() {
    currentTask.value = null
  }

  function clearTasks() {
    tasks.value = []
    pagination.value = {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0
    }
  }

  return {
    tasks,
    currentTask,
    isLoading,
    pagination,

    totalTasks,
    hasTasks,
    pendingTasks,
    completedTasks,
    inactiveTasks,

    updateFilters,
    fetchTasks,
    fetchTask,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    setCurrentTask,
    clearCurrentTask,
    clearTasks
  }
})
