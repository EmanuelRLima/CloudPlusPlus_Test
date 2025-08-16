import { ref, computed } from 'vue'

export function useFormValidation(validationRules) {
  const errors = ref({})
  const touched = ref({})

  const isValid = computed(() => {
    return Object.keys(errors.value).length === 0
  })

  function validate(data) {
    const validation = validationRules(data)
    errors.value = validation.errors
    return validation.isValid
  }

  function validateField(field, value, data) {
    touched.value[field] = true
    const validation = validationRules({ ...data, [field]: value })

    if (validation.errors[field]) {
      errors.value[field] = validation.errors[field]
    } else {
      delete errors.value[field]
    }
  }

  function clearErrors() {
    errors.value = {}
    touched.value = {}
  }

  function getFieldError(field) {
    return touched.value[field] ? errors.value[field] : null
  }

  return {
    errors,
    touched,
    isValid,
    validate,
    validateField,
    clearErrors,
    getFieldError
  }
}
