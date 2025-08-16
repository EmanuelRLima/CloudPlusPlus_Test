import { ref, computed, watch } from 'vue'

export function useProjectFilters(store) {
  const filters = ref({
    search: '',
    status: '',
    sort_by: 'start_date',
    sort_direction: 'desc'
  })

  const searchTimeout = ref(null)

  const hasFilters = computed(() => {
    return filters.value.search || filters.value.status
  })

  watch(
    () => filters.value,
    () => store.setFilters(filters.value),
    { deep: true }
  )

  function handleSearch() {
    if (searchTimeout.value) {
      clearTimeout(searchTimeout.value)
    }
    searchTimeout.value = setTimeout(() => {
      handleFilter()
    }, 500)
  }

  function handleFilter() {
    setTimeout(() => {
      store.fetchProjects(1)
    }, 500)
  }

  function clearFilters() {
    filters.value = {
      search: '',
      status: '',
      sort_by: 'start_date',
      sort_direction: 'desc'
    }
    store.clearFilters()
    store.fetchProjects(1)
  }

  return {
    filters,
    hasFilters,
    handleSearch,
    handleFilter,
    clearFilters
  }
}
