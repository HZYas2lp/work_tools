<template>
  <div class="home-page">
    <div class="hero-section animate-fade-in">
      <div class="text-center py-12 md:py-16">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 mb-6">
          <span class="text-4xl">🛠️</span>
        </div>
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">办公工具箱</h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          一站式办公效率工具集合，所有数据本地处理，安全可靠。
          支持 Excel、PDF、图片、文本等多种格式处理。
        </p>
      </div>
    </div>
    
    <div class="categories-section animate-slide-up">
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <button
          v-for="category in categories"
          :key="category.id"
          @click="navigateToCategory(category.id)"
          class="category-card flex flex-col items-center p-4 rounded-xl bg-white hover:bg-primary-50 transition-all duration-200 hover:shadow-card-hover"
        >
          <span class="text-3xl mb-2">{{ category.icon }}</span>
          <span class="text-sm font-medium text-gray-700">{{ category.name }}</span>
        </button>
      </div>
    </div>
    
    <div class="tools-section">
      <h2 class="text-xl font-bold text-gray-900 mb-4">所有工具</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <router-link
          v-for="tool in tools"
          :key="tool.path"
          :to="tool.path"
          class="tool-card group block"
        >
          <div class="card p-5 h-full">
            <div class="flex items-start justify-between mb-3">
              <div class="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                <span class="text-2xl">{{ tool.meta.icon }}</span>
              </div>
              <span class="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                {{ getCategoryName(tool.category) }}
              </span>
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
          <p class="text-gray-500">暂无工具，添加工具到 tools 目录即可自动显示</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { getCategories, getAllTools, getCategoryName } from '../router'

const router = useRouter()

const categories = getCategories()
const tools = computed(() => getAllTools())

function navigateToCategory(categoryId) {
  router.push(`/${categoryId}`)
}
</script>

<style scoped>
.category-card:hover {
  transform: translateY(-2px);
}

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
