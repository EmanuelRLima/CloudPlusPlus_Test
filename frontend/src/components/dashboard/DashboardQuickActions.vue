<template>
  <div class="card">
    <div class="card-header">
      <h2 class="text-lg font-medium text-gray-900">Quick Actions</h2>
    </div>
    <div class="card-body">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
        <ActionButton
          to="/projects/create"
          icon="PlusCircleIcon"
          title="Create Project"
          description="Start a new project"
        />

        <ActionButton
          to="/projects"
          icon="FolderOpenIcon"
          title="View All Projects"
          description="See all projects"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import ActionButton from '@/components/dashboard/DashboardActionButton.vue'
</script>
