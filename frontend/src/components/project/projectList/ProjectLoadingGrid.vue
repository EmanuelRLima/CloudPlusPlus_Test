<template>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    <div v-for="i in 6" :key="i" class="card animate-pulse">
      <div class="card-body">
        <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div class="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div class="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  </div>
</template>
