<template>
  <AuthLayout>
    <AuthHeader
      title="Sign in to your account"
      subtitle="Or"
      link-to="/register"
      link-text="create a new account"
    />

    <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
      <div class="space-y-4">
        <FormInput
          id="login"
          label="Username or E-mail"
          v-model="form.login"
          type="text"
          autocomplete="username"
          :required="true"
          placeholder="Enter your username or e-mail"
          :error="errors.login?.[0]"
        />

        <FormInput
          id="password"
          label="Password"
          v-model="form.password"
          type="password"
          autocomplete="current-password"
          :required="true"
          placeholder="Enter your password"
          :error="errors.password?.[0]"
        />

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember"
              v-model="form.remember"
              type="checkbox"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label for="remember" class="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-primary-600 hover:text-primary-500 transition-colors">
              Forgot your password?
            </a>
          </div>
        </div>
      </div>

      <LoadingButton
        type="submit"
        :loading="authStore.isLoading"
        text="Sign in"
        loading-text="Signing in..."
      />
    </form>
  </AuthLayout>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthLayout from '@/components/auth/AuthLayout.vue'
import AuthHeader from '@/components/auth/AuthHeader.vue'
import FormInput from '@/components/forms/FormInput.vue'
import LoadingButton from '@/components/forms/LoadingButton.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const errors = ref({})
const form = reactive({
  login: '',
  password: '',
  remember: false
})

onMounted(() => {
  authStore.showPendingMessage()
})

async function handleSubmit() {
  errors.value = {}

  const result = await authStore.login(form)

  if (result.success) {
    const redirectTo = route.query.redirect || '/dashboard'
    router.push(redirectTo)
  } else {
    errors.value = result.errors || {}
  }
}
</script>
