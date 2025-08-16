export function validateProjectForm(data) {
  const errors = {}

  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Project name is required'
  } else if (data.name.trim().length < 3) {
    errors.name = 'Project name must be at least 3 characters'
  } else if (data.name.trim().length > 100) {
    errors.name = 'Project name must be less than 100 characters'
  }

  if (!data.value || data.value === '') {
    errors.value = 'Project value is required'
  } else {
    const numValue = parseFloat(data.value)
    if (isNaN(numValue) || numValue <= 0) {
      errors.value = 'Project value must be a positive number'
    } else if (numValue > 1000000000) {
      errors.value = 'Project value cannot exceed $1,000,000,000'
    }
  }

  if (!data.start_date) {
    errors.start_date = 'Start date is required'
  }

  if (!data.end_date) {
    errors.end_date = 'End date is required'
  }

  if (data.start_date && data.end_date) {
    const startDate = new Date(data.start_date)
    const endDate = new Date(data.end_date)

    if (startDate >= endDate) {
      errors.end_date = 'End date must be after start date'
    }

    const maxDuration = 10 * 365 * 24 * 60 * 60 * 1000
    if (endDate - startDate > maxDuration) {
      errors.end_date = 'Project duration cannot exceed 10 years'
    }
  }

  if (data.description && data.description.length > 1000) {
    errors.description = 'Description must be less than 1000 characters'
  }

  if (data.status && !['active', 'inactive'].includes(data.status)) {
    errors.status = 'Invalid status selected'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}
