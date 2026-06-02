<template>
  <div class="category-page">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          <span class="mr-2">{{ currentCategory?.icon }}</span>
          {{ currentCategory?.name }}
        </h1>
        <p class="text-gray-500 mt-1">共 {{ tools.length }} 个工具</p>
      </div>
      <router-link
        to="/"
        class="btn-secondary"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        返回首页
      </router-link>
    </div>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <router-link
        v-for="tool in tools"
        :key="tool.path"
        :to="tool.path"
        class="tool-card group block"
      >
        <div class="card p-5 h-full">
          <div class="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mb-4">
            <span class="text-2xl">{{ tool.meta.icon }}</span>
          </div>
          <h3 class="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
            {{ tool.meta.title }}
          </h3>
          <p class="text-sm text-gray-500">{{ tool.meta.description }}</p>
        </div>
      </router-link>
      
      <div v-if="tools.length === 0" class="col-span-full text-center py-12">
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <p class="text-gray-500">该分类暂无工具</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getCategories, getToolsByCategory } from '../router'

const route = useRoute()

const categoryId = computed(() => route.params.category)

const currentCategory = computed(() => {
  return getCategories().find(cat => cat.id === categoryId.value)
})

const tools = computed(() => {
  return getToolsByCategory(categoryId.value)
})
</script>

<style scoped>
.tool-card {
  text-decoration: none;
}

.tool-card:hover .card {
  transform: translateY(-4px);
}

.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
</style>
