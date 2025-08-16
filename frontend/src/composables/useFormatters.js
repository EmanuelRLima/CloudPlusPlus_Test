export function useFormatters() {
  function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  function calculateDuration(startDate, endDate) {
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
  }

  function calculateDaysRemaining(endDate) {
    const today = new Date()
    const end = new Date(endDate)
    const diffTime = end - today
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  function isOverdue(endDate) {
    const today = new Date()
    const end = new Date(endDate)
    return end < today
  }

  function formatDateTime(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

  function getDaysUntilDue(dueDate) {
  const today = new Date()
  const due = new Date(dueDate)
  const diffTime = due - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return `${Math.abs(diffDays)} days overdue`
  } else if (diffDays === 0) {
    return 'Due today'
  } else if (diffDays === 1) {
    return 'Due tomorrow'
  } else if (diffDays < 7) {
    return `${diffDays} days remaining`
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} week${weeks > 1 ? 's' : ''} remaining`
  } else {
    const months = Math.floor(diffDays / 30)
    return `${months} month${months > 1 ? 's' : ''} remaining`
  }
}

  return {
    formatDateTime,
    getDaysUntilDue,
    formatCurrency,
    formatDate,
    calculateDuration,
    calculateDaysRemaining,
    isOverdue
  }
}
