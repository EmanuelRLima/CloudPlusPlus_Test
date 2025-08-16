<template>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
    <StatCard
      icon="FolderIcon"
      title="Total Projects"
      :value="stats.totalProjects"
      iconColor="primary"
    />

    <StatCard
      icon="CheckCircleIcon"
      title="Active Projects"
      :value="stats.activeProjects"
      iconColor="green"
    />

    <StatCard
      icon="ClockIcon"
      title="Inactive Tasks"
      :value="stats.inactiveProjects"
      iconColor="gray"
    />

    <StatCard
      icon="CurrencyDollarIcon"
      title="Total Value"
      :value="`$${formatCurrency(stats.totalValue)}`"
      iconColor="blue"
    />
  </div>
</template>

<script setup>
import StatCard from '@/components/dashboard/DashboardStatCard.vue'
import { formatCurrency } from '@/components/utils/utils.js'
defineProps({
  stats: {
    type: Object,
    required: true
  }
})
</script>
