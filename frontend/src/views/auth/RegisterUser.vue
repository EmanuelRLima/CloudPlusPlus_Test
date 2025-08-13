<template>
  <AuthLayout>
    <AuthHeader
      title="Create your account"
      subtitle="Or"
      link-to="/login"
      link-text="sign in to your existing account"
    >
      <template #icon>
        <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      </template>
    </AuthHeader>

    <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
      <div class="space-y-4">
        <PhotoUpload
          @update:photo="form.photo = $event"
          @update:preview="photoPreview = $event"
        />

        <p class="text-center text-sm text-gray-500 mb-4">
          Click to upload your profile photo
        </p>

        <FormInput
          id="name"
          label="Full name"
          v-model="form.name"
          type="text"
          autocomplete="name"
          :required="true"
          placeholder="Enter your full name"
          :error="errors.name?.[0]"
        />

        <FormInput
          id="username"
          label="Username"
          v-model="form.username"
          type="text"
          autocomplete="username"
          :required="true"
          placeholder="Enter your username"
          :error="errors.username?.[0]"
        />

        <FormInput
          id="email"
          label="Email address"
          v-model="form.email"
          type="email"
          autocomplete="email"
          :required="true"
          placeholder="Enter your email"
          :error="errors.email?.[0]"
        />

        <FormInput
          id="password"
          label="Password"
          v-model="form.password"
          type="password"
          autocomplete="new-password"
          :required="true"
          placeholder="Enter your password"
          :error="errors.password?.[0]"
        />

        <FormInput
          id="password_confirmation"
          label="Confirm password"
          v-model="form.password_confirmation"
          type="password"
          autocomplete="new-password"
          :required="true"
          placeholder="Confirm your password"
          :error="errors.password_confirmation?.[0]"
        />

        <div class="flex items-center">
          <input
            id="terms"
            v-model="form.terms"
            type="checkbox"
            required
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label for="terms" class="ml-2 block text-sm text-gray-900">
            I agree to the
            <a href="#" class="text-primary-600 hover:text-primary-500">Terms and Conditions</a>
            and
            <a href="#" class="text-primary-600 hover:text-primary-500">Privacy Policy</a>
          </label>
        </div>
      </div>

      <LoadingButton
        type="submit"
        :loading="authStore.isLoading"
        :disabled="!form.terms"
        text="Create account"
        loading-text="Creating account..."
      />
    </form>
  </AuthLayout>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthLayout from '@/components/auth/AuthLayout.vue'
import AuthHeader from '@/components/auth/AuthHeader.vue'
import FormInput from '@/components/forms/FormInput.vue'
import PhotoUpload from '@/components/forms/PhotoUpload.vue'
import LoadingButton from '@/components/forms/LoadingButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const errors = ref({})
const photoPreview = ref(null)

const form = reactive({
  name: '',
  username: '',
  email: '',
  password: '',
  password_confirmation: '',
  terms: false,
  photo: null
})

async function handleSubmit() {
  errors.value = {}

  const formData = new FormData()
  Object.keys(form).forEach(key => {
    if (key === 'photo' && form.photo) {
      formData.append('photo', form.photo)
    } else if (key !== 'photo') {
      formData.append(key, form[key])
    }
  })

  const result = await authStore.register(formData)

  if (result.success) {
    router.push('/dashboard')
  } else {
    errors.value = result.errors || {}
  }
}
</script>
