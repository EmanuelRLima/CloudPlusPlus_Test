<template>
  <div class="card">
    <div class="card-body">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div>
          <label for="search" class="block text-sm font-medium text-gray-700">Search</label>
          <input
            id="search"
            :value="filters.search"
            @input="updateFilter('search', $event.target.value)"
            type="text"
            placeholder="Search projects..."
            class="form-input mt-1"
          />
        </div>
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="status"
            :value="filters.status"
            @change="updateFilter('status', $event.target.value)"
            class="form-select mt-1"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div>
          <label for="sort" class="block text-sm font-medium text-gray-700">Sort by</label>
          <select
            id="sort"
            :value="filters.sort_by"
            @change="updateFilter('sort_by', $event.target.value)"
            class="form-select mt-1"
          >
            <option value="start_date">Start Date</option>
            <option value="end_date">End Date</option>
            <option value="name">Name</option>
            <option value="value">Value</option>
          </select>
        </div>
        <div>
          <label for="direction" class="block text-sm font-medium text-gray-700">Direction</label>
          <select
            id="direction"
            :value="filters.sort_direction"
            @change="updateFilter('sort_direction', $event.target.value)"
            class="form-select mt-1"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  filters: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['search', 'filter', 'update:filters'])

function updateFilter(key, value) {
  const newFilters = { ...props.filters, [key]: value }
  emit('update:filters', newFilters)

  if (key === 'search') {
    emit('search')
  } else {
    emit('filter')
  }
}
</script>
