<template>
  <AppLayout>
    <div class="max-w-4xl mx-auto space-y-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p class="mt-2 text-sm text-gray-700">
            Manage your account information and preferences
          </p>
        </div>
        <router-link to="/dashboard" class="btn-secondary">
          <ArrowLeftIcon class="h-5 w-5 mr-2" />
          Back to Dashboard
        </router-link>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-8">

          <div class="card">
            <div class="card-header">
              <h2 class="text-lg font-medium text-gray-900">Personal Information</h2>
              <p class="text-sm text-gray-500">Update your personal details and contact information.</p>
            </div>
            <div class="card-body">
              <form @submit.prevent="updateProfile" class="space-y-6">
                <!-- Profile Photo -->
                <!-- <div>
                  <label class="block text-sm font-medium text-gray-700 mb-4">
                    Profile Photo
                  </label>
                  <PhotoUpload
                    @update:photo="handlePhotoUpdate"
                    @update:preview="photoPreview = $event"
                  />
                </div> TODO: photo upload
 -->
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700">
                    Full Name <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    placeholder="Enter your full name"
                    :class="[
                      'form-input mt-1',
                      errors.name ? 'form-input-error' : ''
                    ]"
                    required
                  />
                  <p v-if="errors.name" class="mt-1 text-sm text-red-600">
                    {{ errors.name[0] }}
                  </p>
                </div>

                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700">
                    Email Address <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    placeholder="Enter your email address"
                    :class="[
                      'form-input mt-1',
                      errors.email ? 'form-input-error' : ''
                    ]"
                    required
                  />
                  <p v-if="errors.email" class="mt-1 text-sm text-red-600">
                    {{ errors.email[0] }}
                  </p>
                </div>

                <div class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    @click="resetForm"
                    class="btn-secondary"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    :disabled="authStore.isLoading"
                    class="btn-primary"
                  >
                    <div v-if="authStore.isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white">
                      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    {{ authStore.isLoading ? 'Updating...' : 'Update Profile' }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h2 class="text-lg font-medium text-gray-900">Change Password</h2>
              <p class="text-sm text-gray-500">Update your password to keep your account secure.</p>
            </div>
            <div class="card-body">
              <form @submit.prevent="updatePassword" class="space-y-6">
                <div>
                  <label for="current_password" class="block text-sm font-medium text-gray-700">
                    Current Password <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="current_password"
                    v-model="passwordForm.current_password"
                    type="password"
                    placeholder="Enter your current password"
                    :class="[
                      'form-input mt-1',
                      passwordErrors.current_password ? 'form-input-error' : ''
                    ]"
                    required
                  />
                  <p v-if="passwordErrors.current_password" class="mt-1 text-sm text-red-600">
                    {{ passwordErrors.current_password[0] }}
                  </p>
                </div>

                <div>
                  <label for="new_password" class="block text-sm font-medium text-gray-700">
                    New Password <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="new_password"
                    v-model="passwordForm.new_password"
                    type="password"
                    placeholder="Enter your new password"
                    :class="[
                      'form-input mt-1',
                      passwordErrors.new_password ? 'form-input-error' : ''
                    ]"
                    required
                  />
                  <p v-if="passwordErrors.new_password" class="mt-1 text-sm text-red-600">
                    {{ passwordErrors.new_password[0] }}
                  </p>
                  <p class="mt-1 text-sm text-gray-500">
                    Password must be at least 8 characters long.
                  </p>
                </div>

                <div>
                  <label for="confirm_password" class="block text-sm font-medium text-gray-700">
                    Confirm New Password <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="confirm_password"
                    v-model="passwordForm.confirm_password"
                    type="password"
                    placeholder="Confirm your new password"
                    :class="[
                      'form-input mt-1',
                      passwordErrors.confirm_password ? 'form-input-error' : ''
                    ]"
                    required
                  />
                  <p v-if="passwordErrors.confirm_password" class="mt-1 text-sm text-red-600">
                    {{ passwordErrors.confirm_password[0] }}
                  </p>
                </div>

                <div class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    @click="resetPasswordForm"
                    class="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    :disabled="authStore.isLoading"
                    class="btn-primary"
                  >
                    <div v-if="authStore.isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white">
                      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    {{ authStore.isLoading ? 'Updating...' : 'Update Password' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div class="space-y-8">
          <div class="card">
            <div class="card-header">
              <h2 class="text-lg font-medium text-gray-900">Account Overview</h2>
            </div>
            <div class="card-body">
              <div class="flex items-center space-x-4 mb-6">
                <div class="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
                  <span class="text-xl font-bold text-primary-600">
                    {{ authStore.user?.username?.charAt(0).toUpperCase() }}
                  </span>
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-900">{{ authStore.user?.username }}</h3>
                  <p class="text-sm text-gray-500">{{ authStore.user?.email }}</p>
                </div>
              </div>

              <dl class="space-y-3">
                <div class="flex justify-between">
                  <dt class="text-sm font-medium text-gray-500">Member since</dt>
                  <dd class="text-sm text-gray-900">{{ formatDate(authStore.user?.created_at) }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-sm font-medium text-gray-500">Last login</dt>
                  <dd class="text-sm text-gray-900">{{ formatDate(authStore.user?.last_login_at) }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-sm font-medium text-gray-500">Profile updated</dt>
                  <dd class="text-sm text-gray-900">{{ formatDate(authStore.user?.updated_at) }}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h2 class="text-lg font-medium text-gray-900">Your Activity</h2>
            </div>
            <div class="card-body">
              <div class="space-y-4">
                <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div class="flex items-center space-x-3">
                    <div class="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FolderIcon class="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p class="text-sm font-medium text-blue-900">Projects</p>
                      <p class="text-xs text-blue-700">Total created</p>
                    </div>
                  </div>
                  <span class="text-lg font-bold text-blue-900">{{ projectsStore.totalProjects }}</span>
                </div>

                <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div class="flex items-center space-x-3">
                    <div class="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircleIcon class="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p class="text-sm font-medium text-green-900">Active Projects</p>
                      <p class="text-xs text-green-700">Currently working</p>
                    </div>
                  </div>
                  <span class="text-lg font-bold text-green-900">{{ projectsStore.activeProjects.length }}</span>
                </div>

                <div class="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div class="flex items-center space-x-3">
                    <div class="h-8 w-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <ClipboardDocumentListIcon class="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p class="text-sm font-medium text-yellow-900">Total Tasks</p>
                      <p class="text-xs text-yellow-700">Across all projects</p>
                    </div>
                  </div>
                  <span class="text-lg font-bold text-yellow-900">{{ tasksStore.totalTasks }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h2 class="text-lg font-medium text-gray-900">Quick Actions</h2>
            </div>
            <div class="card-body">
              <div class="space-y-3">
                <router-link to="/projects/create" class="w-full btn-primary text-center">
                  <PlusIcon class="h-4 w-4 mr-2" />
                  Create New Project
                </router-link>
                <router-link to="/projects" class="w-full btn-secondary text-center">
                  <FolderIcon class="h-4 w-4 mr-2" />
                  View All Projects
                </router-link>
                <router-link to="/dashboard" class="w-full btn-secondary text-center">
                  <HomeIcon class="h-4 w-4 mr-2" />
                  Back to Dashboard
                </router-link>
              </div>
            </div>
          </div>

          <div class="card border-red-200">
            <div class="card-header">
              <h2 class="text-lg font-medium text-red-900">Danger Zone</h2>
              <p class="text-sm text-red-600">Irreversible and destructive actions.</p>
            </div>
            <div class="card-body">
              <button
                @click="confirmDeleteAccount"
                class="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                <ExclamationTriangleIcon class="h-4 w-4 mr-2 inline" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <TransitionRoot as="template" :show="showDeleteModal">
      <Dialog as="div" class="relative z-10" @close="showDeleteModal = false">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div class="sm:flex sm:items-start">
                  <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon class="h-6 w-6 text-red-600" />
                  </div>
                  <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">
                      Delete Account
                    </DialogTitle>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your projects and tasks.
                      </p>
                    </div>
                  </div>
                </div>
                <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    @click="deleteAccount"
                    :disabled="authStore.isLoading"
                  >
                    Delete Account
                  </button>
                  <button
                    type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    @click="showDeleteModal = false"
                  >
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </AppLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useProjectsStore } from '@/stores/projects'
import { useTasksStore } from '@/stores/tasks'
import { toast } from 'vue3-toastify'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useFormatters } from '@/composables/useFormatters.js'

const { formatDate } = useFormatters()
/* import PhotoUpload from '@/components/ui/PhotoUpload.vue' */
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import {
  ArrowLeftIcon,
  FolderIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  PlusIcon,
  HomeIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()
const projectsStore = useProjectsStore()
const tasksStore = useTasksStore()

const form = reactive({
  name: '',
  email: '',
})

const passwordForm = reactive({
  current_password: '',
  new_password: '',
  confirm_password: ''
})

const errors = ref({})
const passwordErrors = ref({})
const photoPreview = ref(null)
const selectedPhoto = ref(null)
const showDeleteModal = ref(false)

onMounted(() => {
  loadUserData()
  loadStats()
})

function loadUserData() {
  if (authStore.user) {
    form.name = authStore.user.name || ''
    form.email = authStore.user.email || ''
  }
}

async function loadStats() {
  await projectsStore.fetchProjects()
}

/* function handlePhotoUpdate(file) {
  selectedPhoto.value = file
} */

async function updateProfile() {
  errors.value = {}

  const formData = new FormData()
  Object.keys(form).forEach(key => {
    if (form[key]) {
      formData.append(key, form[key])
    }
  })

  if (selectedPhoto.value) {
    formData.append('photo', selectedPhoto.value)
  }

  try {
    // const response = await api.post('/v1/profile/update', formData) TODO: implement API call
    toast.success('Profile updated successfully')
    // authStore.user = { ...authStore.user, ...form }

  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    }
    toast.error('Failed to update profile')
  }
}

async function updatePassword() {
  passwordErrors.value = {}

  if (passwordForm.new_password !== passwordForm.confirm_password) {
    passwordErrors.value.confirm_password = ['Passwords do not match']
    return
  }

  try {
    // const response = await api.post('/v1/profile/password', passwordForm) TODO: implement API call
    toast.success('Password updated successfully')
    resetPasswordForm()

  } catch (error) {
    if (error.response?.data?.errors) {
      passwordErrors.value = error.response.data.errors
    }
    toast.error('Failed to update password')
  }
}

function resetForm() {
  loadUserData()
  selectedPhoto.value = null
  photoPreview.value = null
  errors.value = {}
}

function resetPasswordForm() {
  passwordForm.current_password = ''
  passwordForm.new_password = ''
  passwordForm.confirm_password = ''
  passwordErrors.value = {}
}

function confirmDeleteAccount() {
  showDeleteModal.value = true
}

async function deleteAccount() {
  try {
    // await api.delete('/v1/profile/delete')
    toast.success('Account deleted successfully')
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    toast.error(error)
  }
}

</script>
