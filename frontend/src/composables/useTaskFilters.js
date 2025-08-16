import { ref, computed } from 'vue'

export function useTaskFilters(tasksStore, projectId) {
  const searchTimeout = ref(null)

  const filters = ref({
    search: '',
    status: '',
    sort_by: 'due_date',
    sort_direction: 'desc'
  })

  const hasFilters = computed(() => {
    return Boolean(filters.value.search || filters.value.status)
  })

  function updateFilters(newFilters) {
    tasksStore.updateFilters(newFilters)
    filters.value = { ...newFilters }
  }

  function handleSearch() {
    if (searchTimeout.value) {
      clearTimeout(searchTimeout.value)
    }

    searchTimeout.value = setTimeout(() => {
      handleFilter()
    }, 500)
  }

  async function handleFilter() {
    tasksStore.updateFilters(filters.value)

    const result = await tasksStore.fetchTasks(projectId.value, 1)
    if (!result.success) {
      console.error('Failed to filter tasks:', result.error)
    }
  }

  function clearFilters() {
    const clearedFilters = {
      search: '',
      status: '',
      sort_by: 'due_date',
      sort_direction: 'desc'
    }

    filters.value = clearedFilters
    updateFilters(clearedFilters)
    handleFilter()
  }

  return {
    filters,
    hasFilters,
    updateFilters,
    handleSearch,
    handleFilter,
    clearFilters
  }
}
