import { ref } from 'vue'
import { toast } from 'vue3-toastify'
import { useRouter } from 'vue-router'

export function useProjectActions(store) {
  const router = useRouter()
  const showDeleteModal = ref(false)
  const projectToDelete = ref(null)
  const isLoading = ref(false)

  async function confirmDelete(project) {
    projectToDelete.value = project
    showDeleteModal.value = true
  }

  async function deleteProject() {
    if (!projectToDelete.value) return

    isLoading.value = true
    try {
      const result = await store.deleteProject(projectToDelete.value.id)
      if (result.success) {
        toast.success('Project deleted successfully')
        await store.fetchProjects(1)
        showDeleteModal.value = false
        projectToDelete.value = null

        if (router.currentRoute.value.name === 'projects.show') {
          router.push('/projects')
        }
      } else {
        toast.error(result.error)
      }
    } finally {
      isLoading.value = false
    }
  }

  async function toggleProjectStatus(project) {
    const newStatus = project.status === 'active' ? 'inactive' : 'active'
    const result = await store.updateProject(project.id, { status: newStatus })

    if (result.success) {
      toast.success(`Project marked as ${newStatus}`)
    } else {
      toast.error('Failed to update project status')
    }
  }

  return {
    showDeleteModal,
    projectToDelete,
    isLoading,
    confirmDelete,
    deleteProject,
    toggleProjectStatus
  }
}
