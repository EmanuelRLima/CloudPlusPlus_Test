<template>
  <div class="flex justify-center mb-6">
    <div class="relative">
      <div class="relative w-24 h-24 overflow-hidden rounded-full border-4 border-gray-200 hover:border-primary-400 transition-colors cursor-pointer group"
           @click="triggerFileInput">
        <div v-if="!photoPreview"
             class="w-full h-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
          <svg class="w-8 h-8 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <img v-else
             :src="photoPreview"
             alt="photo preview"
             class="w-full h-full object-cover" />

        <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </div>

      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        @change="handleImageUpload"
        class="hidden"
      />

      <button v-if="photoPreview"
              type="button"
              @click.stop="removeImage"
              class="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { toast } from 'vue3-toastify'

const emit = defineEmits(['update:photo', 'update:preview'])

const photoPreview = ref(null)
const fileInput = ref(null)

function triggerFileInput() {
  fileInput.value.click()
}

function handleImageUpload(event) {
  const file = event.target.files[0]

  if (file) {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      photoPreview.value = e.target.result
      emit('update:preview', e.target.result)
    }
    reader.readAsDataURL(file)

    emit('update:photo', file)
  }
}

function removeImage() {
  photoPreview.value = null
  emit('update:photo', null)
  emit('update:preview', null)
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>
