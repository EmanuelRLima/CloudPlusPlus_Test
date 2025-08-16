import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProjectsStore } from '@/stores/projects'
import api from '@/services/api'

vi.mock('@/services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

describe('useProjectsStore', () => {
  let projectsStore

  beforeEach(() => {
    setActivePinia(createPinia())
    projectsStore = useProjectsStore()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('Initial State', () => {
    it('should have the correct initial state', () => {
      expect(projectsStore.projects).toEqual([])
      expect(projectsStore.currentProject).toBe(null)
      expect(projectsStore.isLoading).toBe(false)
      expect(projectsStore.pagination).toEqual({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
      })
      expect(projectsStore.filters).toEqual({
        search: '',
        status: '',
        sort_by: 'start_date',
        sort_direction: 'desc'
      })
    })
  })

  describe('Computed Properties', () => {
    it('should calculate totalProjects correctly', () => {
      projectsStore.pagination.total = 42
      expect(projectsStore.totalProjects).toBe(42)
    })

    it('should calculate hasProjects correctly', () => {
      expect(projectsStore.hasProjects).toBe(false)

      projectsStore.projects = [{ id: 1, name: 'Test Project' }]
      expect(projectsStore.hasProjects).toBe(true)
    })

    it('should calculate project counts correctly', () => {
      projectsStore.pagination.total_active = 20
      projectsStore.pagination.total_inactive = 8

      expect(projectsStore.activeProjects).toBe(20)
      expect(projectsStore.inactiveProjects).toBe(8)
    })
  })

  describe('setFilters', () => {
    it('should set filters correctly', () => {
      const newFilters = {
        search: 'project search',
        status: 'active'
      }

      projectsStore.setFilters(newFilters)

      expect(projectsStore.filters).toEqual({
        search: 'project search',
        status: 'active',
        sort_by: 'start_date',
        sort_direction: 'desc'
      })
    })

  })

  describe('fetchProjects', () => {
    const mockProjects = [
      { id: 1, name: 'Project 1', status: 'active' },
      { id: 2, name: 'Project 2', status: 'inactive' }
    ]

    const mockResponse = {
      data: {
        data: mockProjects,
        meta: {
          current_page: 1,
          last_page: 3,
          per_page: 10,
          total: 35,
          total_active: 25,
          total_inactive: 10
        }
      }
    }

    it('should fetch projects successfully', async () => {
      api.get.mockResolvedValue(mockResponse)

      const result = await projectsStore.fetchProjects()

      expect(api.get).toHaveBeenCalledWith('v1/projects', {
        params: {
          page: 1,
          per_page: 10,
          sort_by: 'start_date',
          sort_direction: 'desc'
        }
      })
      expect(projectsStore.projects).toEqual(mockProjects)
      expect(projectsStore.pagination).toEqual(mockResponse.data.meta)
      expect(result).toEqual({ success: true })
      expect(projectsStore.isLoading).toBe(false)
    })

    it('should handle fetch error', async () => {
      const mockError = {
        response: {
          data: { message: 'Failed to load projects' }
        }
      }
      api.get.mockRejectedValue(mockError)

      const result = await projectsStore.fetchProjects()

      expect(result).toEqual({
        success: false,
        error: 'Failed to load projects'
      })
      expect(projectsStore.isLoading).toBe(false)
    })

    it('should handle error without specific response', async () => {
      api.get.mockRejectedValue(new Error('Network error'))

      const result = await projectsStore.fetchProjects()

      expect(result).toEqual({
        success: false,
        error: 'Failed to fetch projects'
      })
    })
  })

  describe('fetchProject', () => {
    const mockProject = {
      id: 1,
      name: 'Test Project',
      description: 'Project description',
      status: 'active'
    }

    it('should fetch single project successfully', async () => {
      api.get.mockResolvedValue({ data: { data: mockProject } })

      const result = await projectsStore.fetchProject(1)

      expect(api.get).toHaveBeenCalledWith('v1/projects/1')
      expect(projectsStore.currentProject).toEqual(mockProject)
      expect(result).toEqual({ success: true })
      expect(projectsStore.isLoading).toBe(false)
    })

    it('should handle fetch single project error', async () => {
      const mockError = {
        response: {
          data: { message: 'Project not found' }
        }
      }
      api.get.mockRejectedValue(mockError)

      const result = await projectsStore.fetchProject(999)

      expect(result).toEqual({
        success: false,
        error: 'Project not found'
      })
      expect(projectsStore.isLoading).toBe(false)
    })
  })

  describe('createProject', () => {
    const mockProjectData = {
      name: 'New Project',
      description: 'Project description',
      start_date: '2024-01-01',
      end_date: '2024-12-31'
    }

    const mockCreatedProject = { id: 3, ...mockProjectData, status: 'active' }

    it('should create project successfully when on first page', async () => {
      projectsStore.pagination.current_page = 1
      projectsStore.pagination.per_page = 2
      projectsStore.projects = [{ id: 1, name: 'Existing Project' }]

      api.post.mockResolvedValue({ data: { data: mockCreatedProject } })

      const result = await projectsStore.createProject(mockProjectData)

      expect(api.post).toHaveBeenCalledWith('v1/projects', mockProjectData)
      expect(projectsStore.projects[0]).toEqual(mockCreatedProject)
      expect(projectsStore.pagination.total).toBe(1)
      expect(result).toEqual({ success: true, data: mockCreatedProject })
      expect(projectsStore.isLoading).toBe(false)
    })

    it('should handle create project error', async () => {
      const mockError = {
        response: {
          data: {
            message: 'Validation failed',
            errors: { name: ['Name is required'] }
          }
        }
      }
      api.post.mockRejectedValue(mockError)

      const result = await projectsStore.createProject({})

      expect(result).toEqual({
        success: false,
        errors: { name: ['Name is required'] },
        message: 'Validation failed'
      })
      expect(projectsStore.isLoading).toBe(false)
    })

    it('should handle error without specific response', async () => {
      api.post.mockRejectedValue(new Error('Network error'))

      const result = await projectsStore.createProject(mockProjectData)

      expect(result).toEqual({
        success: false,
        errors: {},
        message: 'Failed to create project'
      })
    })
  })

  describe('updateProject', () => {
    const mockUpdatedProject = { id: 1, name: 'Updated Project', status: 'active' }

    beforeEach(() => {
      projectsStore.projects = [
        { id: 1, name: 'Original Project', status: 'inactive' },
        { id: 2, name: 'Other Project', status: 'active' }
      ]
      projectsStore.currentProject = { id: 1, name: 'Original Project', status: 'inactive' }
    })

    it('should update project successfully', async () => {
      api.put.mockResolvedValue({ data: { data: mockUpdatedProject } })

      const result = await projectsStore.updateProject(1, { name: 'Updated Project' })

      expect(api.put).toHaveBeenCalledWith('v1/projects/1', { name: 'Updated Project' })
      expect(projectsStore.projects[0]).toEqual(mockUpdatedProject)
      expect(projectsStore.currentProject).toEqual(mockUpdatedProject)
      expect(result).toEqual({ success: true, data: mockUpdatedProject })
      expect(projectsStore.isLoading).toBe(false)
    })

    it('should handle update project error', async () => {
      const mockError = {
        response: {
          data: {
            message: 'Update failed',
            errors: { name: ['Name is invalid'] }
          }
        }
      }
      api.put.mockRejectedValue(mockError)

      const result = await projectsStore.updateProject(1, {})

      expect(result).toEqual({
        success: false,
        errors: { name: ['Name is invalid'] },
        message: 'Update failed'
      })
    })

    it('should handle error without specific response', async () => {
      api.put.mockRejectedValue(new Error('Network error'))

      const result = await projectsStore.updateProject(1, {})

      expect(result).toEqual({
        success: false,
        errors: {},
        message: 'Failed to update project'
      })
    })
  })

  describe('deleteProject', () => {
    beforeEach(() => {
      projectsStore.projects = [
        { id: 1, name: 'Project 1' },
        { id: 2, name: 'Project 2' }
      ]
      projectsStore.currentProject = { id: 1, name: 'Project 1' }
      projectsStore.pagination.total = 2
    })

    it('should delete project successfully', async () => {
      api.delete.mockResolvedValue({})

      const result = await projectsStore.deleteProject(1)

      expect(api.delete).toHaveBeenCalledWith('v1/projects/1')
      expect(projectsStore.projects).toEqual([{ id: 2, name: 'Project 2' }])
      expect(projectsStore.currentProject).toBe(null)
      expect(projectsStore.pagination.total).toBe(1)
      expect(result).toEqual({ success: true })
      expect(projectsStore.isLoading).toBe(false)
    })

    it('should handle delete project error', async () => {
      const mockError = {
        response: {
          data: { message: 'Cannot delete project with active tasks' }
        }
      }
      api.delete.mockRejectedValue(mockError)

      const result = await projectsStore.deleteProject(1)

      expect(result).toEqual({
        success: false,
        error: 'Cannot delete project with active tasks'
      })
      expect(projectsStore.projects).toHaveLength(2)
      expect(projectsStore.pagination.total).toBe(2)
    })

    it('should handle error without specific response', async () => {
      api.delete.mockRejectedValue(new Error('Network error'))

      const result = await projectsStore.deleteProject(1)

      expect(result).toEqual({
        success: false,
        error: 'Failed to delete project'
      })
    })
  })

  describe('Utility Functions', () => {
    it('should set current project', () => {
      const project = { id: 1, name: 'Test Project' }
      projectsStore.setCurrentProject(project)

      expect(projectsStore.currentProject).toEqual(project)
    })

    it('should clear current project', () => {
      projectsStore.currentProject = { id: 1, name: 'Test Project' }
      projectsStore.clearCurrentProject()

      expect(projectsStore.currentProject).toBe(null)
    })
  })

  describe('Loading States', () => {
    it('should set isLoading during fetchProjects operation', async () => {
      api.get.mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve({ data: { data: [], meta: {} } }), 100))
      )

      const fetchPromise = projectsStore.fetchProjects()
      expect(projectsStore.isLoading).toBe(true)

      await fetchPromise
      expect(projectsStore.isLoading).toBe(false)
    })

    it('should set isLoading during createProject operation', async () => {
      api.post.mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve({ data: { data: {} } }), 100))
      )

      const createPromise = projectsStore.createProject({})
      expect(projectsStore.isLoading).toBe(true)

      await createPromise
      expect(projectsStore.isLoading).toBe(false)
    })

    it('should set isLoading during updateProject operation', async () => {
      api.put.mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve({ data: { data: {} } }), 100))
      )

      const updatePromise = projectsStore.updateProject(1, {})
      expect(projectsStore.isLoading).toBe(true)

      await updatePromise
      expect(projectsStore.isLoading).toBe(false)
    })

    it('should set isLoading during deleteProject operation', async () => {
      api.delete.mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve({}), 100))
      )

      const deletePromise = projectsStore.deleteProject(1)
      expect(projectsStore.isLoading).toBe(true)

      await deletePromise
      expect(projectsStore.isLoading).toBe(false)
    })
  })

  describe('Filter Integration', () => {
    it('should apply filters correctly in fetchProjects', async () => {
      const mockResponse = { data: { data: [], meta: {} } }
      api.get.mockResolvedValue(mockResponse)

      projectsStore.setFilters({
        search: 'web development',
        status: 'active',
        sort_by: 'name',
        sort_direction: 'asc'
      })

      await projectsStore.fetchProjects(2)

      expect(api.get).toHaveBeenCalledWith('v1/projects', {
        params: {
          page: 2,
          per_page: 10,
          search: 'web development',
          status: 'active',
          sort_by: 'name',
          sort_direction: 'asc'
        }
      })
    })

    it('should maintain filters after clearing and setting new ones', async () => {
      projectsStore.setFilters({ search: 'initial', status: 'active' })
      projectsStore.clearFilters()
      projectsStore.setFilters({ search: 'new search', sort_by: 'end_date' })

      expect(projectsStore.filters).toEqual({
        search: 'new search',
        status: '',
        sort_by: 'end_date',
        sort_direction: 'desc'
      })
    })
  })

})
