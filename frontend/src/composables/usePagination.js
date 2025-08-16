import { toast } from 'vue3-toastify'

export function usePagination(store) {
  async function loadProjects(page = 1) {
    const result = await store.fetchProjects(page)
    if (!result.success) {
      toast.error(result.error)
    }
  }

  async function previousPage() {
    await loadProjects(store.pagination.current_page - 1)
  }

  async function nextPage() {
    await loadProjects(store.pagination.current_page + 1)
  }

  async function goToPage(page) {
    if (typeof page === 'number') {
      await loadProjects(page)
    }
  }

  return {
    loadProjects,
    previousPage,
    nextPage,
    goToPage
  }
}
