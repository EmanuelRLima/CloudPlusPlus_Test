import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTasksStore } from '@/stores/tasks'
import api from '@/services/api'

vi.mock('@/services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

describe('useTasksStore', () => {
  let tasksStore

  beforeEach(() => {
    setActivePinia(createPinia())
    tasksStore = useTasksStore()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('Initial State', () => {
    it('should have the correct initial state', () => {
      expect(tasksStore.tasks).toEqual([])
      expect(tasksStore.currentTask).toBe(null)
      expect(tasksStore.isLoading).toBe(false)
      expect(tasksStore.pagination).toEqual({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
      })
      expect(tasksStore.filters).toEqual({
        search: '',
        status: '',
        sort_by: 'due_date',
        sort_direction: 'desc'
      })
    })
  })

  describe('Computed Properties', () => {
    it('should calculate totalTasks correctly', () => {
      tasksStore.pagination.total = 25
      expect(tasksStore.totalTasks).toBe(25)
    })

    it('should calculate hasTasks correctly', () => {
      expect(tasksStore.hasTasks).toBe(false)

      tasksStore.tasks = [{ id: 1, title: 'Test Task' }]
      expect(tasksStore.hasTasks).toBe(true)
    })

    it('should calculate task counts correctly', () => {
      tasksStore.pagination.total_pending = 10
      tasksStore.pagination.total_completed = 15
      tasksStore.pagination.total_inactive = 5

      expect(tasksStore.pendingTasks).toBe(10)
      expect(tasksStore.completedTasks).toBe(15)
      expect(tasksStore.inactiveTasks).toBe(5)
    })
  })

  describe('updateFilters', () => {
    it('should update filters correctly', () => {
      const newFilters = {
        search: 'test',
        status: 'completed'
      }

      tasksStore.updateFilters(newFilters)

      expect(tasksStore.filters).toEqual({
        search: 'test',
        status: 'completed',
        sort_by: 'due_date',
        sort_direction: 'desc'
      })
    })

    it('should merge filters without overwriting all properties', () => {
      tasksStore.updateFilters({ search: 'initial' })
      tasksStore.updateFilters({ status: 'pending' })

      expect(tasksStore.filters).toEqual({
        search: 'initial',
        status: 'pending',
        sort_by: 'due_date',
        sort_direction: 'desc'
      })
    })
  })

  describe('fetchTasks', () => {
    const mockTasks = [
      { id: 1, title: 'Task 1', status: 'pending' },
      { id: 2, title: 'Task 2', status: 'completed' }
    ]

    const mockResponse = {
      data: {
        data: mockTasks,
        meta: {
          current_page: 1,
          last_page: 2,
          per_page: 10,
          total: 25,
          total_pending: 10,
          total_completed: 15
        }
      }
    }

    it('should fetch tasks successfully', async () => {
      api.get.mockResolvedValue(mockResponse)

      const result = await tasksStore.fetchTasks(1)

      expect(api.get).toHaveBeenCalledWith('v1/projects/1/tasks', {
        params: {
          page: 1,
          per_page: 10,
          sort_by: 'due_date',
          sort_direction: 'desc'
        }
      })
      expect(tasksStore.tasks).toEqual(mockTasks)
      expect(tasksStore.pagination).toEqual(mockResponse.data.meta)
      expect(result).toEqual({ success: true })
      expect(tasksStore.isLoading).toBe(false)
    })

    it('should filter out empty parameters', async () => {
      tasksStore.updateFilters({ search: '', status: null })
      api.get.mockResolvedValue(mockResponse)

      await tasksStore.fetchTasks(1, 2)

      expect(api.get).toHaveBeenCalledWith('v1/projects/1/tasks', {
        params: {
          page: 2,
          per_page: 10,
          sort_by: 'due_date',
          sort_direction: 'desc'
        }
      })
    })

    it('should handle fetch error', async () => {
      const mockError = {
        response: {
          data: { message: 'Failed to load tasks' }
        }
      }
      api.get.mockRejectedValue(mockError)

      const result = await tasksStore.fetchTasks(1)

      expect(result).toEqual({
        success: false,
        error: 'Failed to load tasks'
      })
      expect(tasksStore.isLoading).toBe(false)
    })
  })

  describe('fetchTask', () => {
    const mockTask = { id: 1, title: 'Test Task', description: 'Test description' }

    it('should fetch single task successfully', async () => {
      api.get.mockResolvedValue({ data: { data: mockTask } })

      const result = await tasksStore.fetchTask(1)

      expect(api.get).toHaveBeenCalledWith('v1/tasks/1')
      expect(tasksStore.currentTask).toEqual(mockTask)
      expect(result).toEqual({ success: true })
      expect(tasksStore.isLoading).toBe(false)
    })

    it('should handle fetch single task error', async () => {
      const mockError = {
        response: {
          data: { message: 'Task not found' }
        }
      }
      api.get.mockRejectedValue(mockError)

      const result = await tasksStore.fetchTask(999)

      expect(result).toEqual({
        success: false,
        error: 'Task not found'
      })
      expect(tasksStore.isLoading).toBe(false)
    })
  })

  describe('createTask', () => {
    const mockTaskData = {
      title: 'New Task',
      description: 'Task description',
      due_date: '2024-12-31'
    }

    const mockCreatedTask = { id: 3, ...mockTaskData, status: 'pending' }

    it('should create task successfully when on first page', async () => {
      tasksStore.pagination.current_page = 1
      tasksStore.pagination.per_page = 2
      tasksStore.tasks = [{ id: 1, title: 'Existing Task' }]

      api.post.mockResolvedValue({ data: { data: mockCreatedTask } })

      const result = await tasksStore.createTask(1, mockTaskData)

      expect(api.post).toHaveBeenCalledWith('v1/projects/1/tasks', mockTaskData)
      expect(tasksStore.tasks[0]).toEqual(mockCreatedTask)
      expect(tasksStore.pagination.total).toBe(1)
      expect(result).toEqual({ success: true, data: mockCreatedTask })
      expect(tasksStore.isLoading).toBe(false)
    })


    it('should handle create task error', async () => {
      const mockError = {
        response: {
          data: {
            message: 'Validation failed',
            errors: { title: ['Title is required'] }
          }
        }
      }
      api.post.mockRejectedValue(mockError)

      const result = await tasksStore.createTask(1, {})

      expect(result).toEqual({
        success: false,
        errors: { title: ['Title is required'] },
        message: 'Validation failed'
      })
      expect(tasksStore.isLoading).toBe(false)
    })
  })

  describe('updateTask', () => {
    const mockUpdatedTask = { id: 1, title: 'Updated Task', status: 'completed' }

    beforeEach(() => {
      tasksStore.tasks = [
        { id: 1, title: 'Original Task', status: 'pending' },
        { id: 2, title: 'Other Task', status: 'pending' }
      ]
      tasksStore.currentTask = { id: 1, title: 'Original Task', status: 'pending' }
    })

    it('should update task successfully', async () => {
      api.put.mockResolvedValue({ data: { data: mockUpdatedTask } })

      const result = await tasksStore.updateTask(1, { title: 'Updated Task' })

      expect(api.put).toHaveBeenCalledWith('v1/tasks/1', { title: 'Updated Task' })
      expect(tasksStore.tasks[0]).toEqual(mockUpdatedTask)
      expect(tasksStore.currentTask).toEqual(mockUpdatedTask)
      expect(result).toEqual({ success: true, data: mockUpdatedTask })
      expect(tasksStore.isLoading).toBe(false)
    })

    it('should handle update task error', async () => {
      const mockError = {
        response: {
          data: {
            message: 'Update failed',
            errors: { title: ['Title is invalid'] }
          }
        }
      }
      api.put.mockRejectedValue(mockError)

      const result = await tasksStore.updateTask(1, {})

      expect(result).toEqual({
        success: false,
        errors: { title: ['Title is invalid'] },
        message: 'Update failed'
      })
    })
  })

  describe('deleteTask', () => {
    beforeEach(() => {
      tasksStore.tasks = [
        { id: 1, title: 'Task 1' },
        { id: 2, title: 'Task 2' }
      ]
      tasksStore.currentTask = { id: 1, title: 'Task 1' }
      tasksStore.pagination.total = 2
    })

    it('should delete task successfully', async () => {
      api.delete.mockResolvedValue({})

      const result = await tasksStore.deleteTask(1)

      expect(api.delete).toHaveBeenCalledWith('v1/tasks/1')
      expect(tasksStore.tasks).toEqual([{ id: 2, title: 'Task 2' }])
      expect(tasksStore.currentTask).toBe(null)
      expect(tasksStore.pagination.total).toBe(1)
      expect(result).toEqual({ success: true })
      expect(tasksStore.isLoading).toBe(false)
    })

    it('should handle delete task error', async () => {
      const mockError = {
        response: {
          data: { message: 'Cannot delete task' }
        }
      }
      api.delete.mockRejectedValue(mockError)

      const result = await tasksStore.deleteTask(1)

      expect(result).toEqual({
        success: false,
        error: 'Cannot delete task'
      })
      expect(tasksStore.tasks).toHaveLength(2)
      expect(tasksStore.pagination.total).toBe(2)
    })
  })

  describe('toggleTaskStatus', () => {
    beforeEach(() => {
      tasksStore.tasks = [
        { id: 1, title: 'Task 1', status: 'pending' },
        { id: 2, title: 'Task 2', status: 'completed' }
      ]
    })

    it('should toggle pending task to completed', async () => {
      const updatedTask = { id: 1, title: 'Task 1', status: 'completed' }
      api.put.mockResolvedValue({ data: { data: updatedTask } })

      const result = await tasksStore.toggleTaskStatus(1)

      expect(api.put).toHaveBeenCalledWith('v1/tasks/1', { status: 'completed' })
      expect(result).toEqual({ success: true, data: updatedTask })
    })

    it('should toggle completed task to pending', async () => {
      const updatedTask = { id: 2, title: 'Task 2', status: 'pending' }
      api.put.mockResolvedValue({ data: { data: updatedTask } })

      const result = await tasksStore.toggleTaskStatus(2)

      expect(api.put).toHaveBeenCalledWith('v1/tasks/2', { status: 'pending' })
      expect(result).toEqual({ success: true, data: updatedTask })
    })

    it('should return error if task not found', async () => {
      const result = await tasksStore.toggleTaskStatus(999)

      expect(result).toEqual({ success: false, error: 'Task not found' })
      expect(api.put).not.toHaveBeenCalled()
    })
  })

  describe('Utility Functions', () => {
    it('should set current task', () => {
      const task = { id: 1, title: 'Test Task' }
      tasksStore.setCurrentTask(task)

      expect(tasksStore.currentTask).toEqual(task)
    })

    it('should clear current task', () => {
      tasksStore.currentTask = { id: 1, title: 'Test Task' }
      tasksStore.clearCurrentTask()

      expect(tasksStore.currentTask).toBe(null)
    })

    it('should clear all tasks and reset pagination', () => {
      tasksStore.tasks = [{ id: 1, title: 'Task' }]
      tasksStore.pagination.total = 10
      tasksStore.pagination.current_page = 3

      tasksStore.clearTasks()

      expect(tasksStore.tasks).toEqual([])
      expect(tasksStore.pagination).toEqual({
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0
      })
    })
  })

  describe('Loading States', () => {
    it('should set isLoading during fetchTasks operation', async () => {
      api.get.mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve({ data: { data: [], meta: {} } }), 100))
      )

      const fetchPromise = tasksStore.fetchTasks(1)
      expect(tasksStore.isLoading).toBe(true)

      await fetchPromise
      expect(tasksStore.isLoading).toBe(false)
    })

    it('should set isLoading during createTask operation', async () => {
      api.post.mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve({ data: { data: {} } }), 100))
      )

      const createPromise = tasksStore.createTask(1, {})
      expect(tasksStore.isLoading).toBe(true)

      await createPromise
      expect(tasksStore.isLoading).toBe(false)
    })
  })

})
