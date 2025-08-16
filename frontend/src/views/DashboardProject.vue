<template>
  <AppLayout>
    <div class="space-y-8">
      <DashboardHeader :user="authStore.user" />
      <DashboardStats :stats="stats" />
      <QuickActions />
      <RecentProjects :projects="recentProjects" :loading="projectsStore.isLoading" />
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useProjectsStore } from '@/stores/projects'
import AppLayout from '@/components/layout/AppLayout.vue'
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue'
import DashboardStats from '@/components/dashboard/DashboardStats.vue'
import QuickActions from '@/components/dashboard/DashboardQuickActions.vue'
import RecentProjects from '@/components/dashboard/DashboardRecentProjects.vue'

const authStore = useAuthStore()
const projectsStore = useProjectsStore()

const stats = ref({
  totalProjects: 0,
  activeProjects: 0,
  inactiveProjects: 0,
  totalValue: 0
})

const recentProjects = computed(() =>
  projectsStore.projects.slice(0, 5)
)

onMounted(async () => {
  await loadDashboardData()
})

async function loadDashboardData() {
  await projectsStore.fetchProjects()

  stats.value = {
    totalProjects: projectsStore.totalProjects,
    activeProjects: projectsStore.activeProjects,
    inactiveProjects: projectsStore.inactiveProjects,
    totalValue: projectsStore.projects.reduce((sum, project) => sum + parseFloat(project.value || 0), 0)
  }
}
</script>
