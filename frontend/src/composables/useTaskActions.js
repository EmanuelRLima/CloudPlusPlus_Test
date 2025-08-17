import { toast } from 'vue3-toastify'

export function useTaskActions(tasksStore) {
  async function toggleTaskStatus(task) {
    const result = await tasksStore.toggleTaskStatus(task.id)
    if (!result.success) {
      toast.error('Failed to update task status')
    } else {
      const result = await tasksStore.fetchTasks(projectId, 1)
    if (!result.success) {
      toast.error('Failed to refresh tasks')
    }
    }
  }

  async function loadTasks(projectId) {
    const result = await tasksStore.fetchTasks(projectId, 1)
    if (!result.success) {
      toast.error('Failed to load tasks')
    }
  }

  return {
    toggleTaskStatus,
    loadTasks
  }
}
