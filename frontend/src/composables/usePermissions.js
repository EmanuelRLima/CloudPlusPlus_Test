//TODO: Permission by "Role"
/* import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

export function usePermissions() {
  const authStore = useAuthStore()

  const can = (permission, resource = null) => {
    const user = authStore.user

    if (!user) return false


    if (user.role === 'admin' || user.role === 'super_admin') {
      return true
    }

    switch (permission) {
      case 'view:project':
        return true

      case 'create:project':
        return user.role === 'manager' || user.role === 'admin'

      case 'edit:project':
        return resource?.owner_id === user.id ||
               user.role === 'manager' ||
               user.permissions?.includes('project.edit')

      case 'delete:project':
        return resource?.owner_id === user.id ||
               user.role === 'manager'

      case 'manage:tasks':
        return resource?.owner_id === user.id ||
               resource?.team_members?.includes(user.id) ||
               user.role === 'manager'

      case 'view:analytics':
        return user.role === 'manager' || user.role === 'admin'

      default:
        return user.permissions?.includes(permission) || false
    }
  }

  const canMultiple = (permissions, resource = null) => {
    return permissions.reduce((acc, permission) => {
      acc[permission] = can(permission, resource)
      return acc
    }, {})
  }

  const isOwner = (resource) => {
    return resource?.owner_id === authStore.user?.id
  }

  const isTeamMember = (project) => {
    return project?.team_members?.includes(authStore.user?.id) || isOwner(project)
  }

  return {
    can: computed(() => can),
    canMultiple: computed(() => canMultiple),
    isOwner: computed(() => isOwner),
    isTeamMember: computed(() => isTeamMember),
    user: computed(() => authStore.user)
  }
}
 */
