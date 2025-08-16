export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

export const dateUtils = {
  calculateDuration(startDate, endDate) {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 30) {
      return `${diffDays} days`
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30)
      const remainingDays = diffDays % 30
      return remainingDays > 0 ? `${months} months, ${remainingDays} days` : `${months} months`
    } else {
      const years = Math.floor(diffDays / 365)
      const remainingDays = diffDays % 365
      const months = Math.floor(remainingDays / 30)
      return `${years} years, ${months} months`
    }
  },

  getTodayISOString() {
    return new Date().toISOString().split('T')[0]
  },

  getFutureDateISOString(daysFromNow) {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + daysFromNow)
    return futureDate.toISOString().split('T')[0]
  }
}


export function isProjectOwner(authStore ,project) {
  return authStore.user?.id === project.owner?.id
}

export function isTaskOverdue(dueDate) {
  return new Date(dueDate) < new Date()
}

