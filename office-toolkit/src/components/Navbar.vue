<template>
  <nav class="bg-white shadow-card sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center space-x-3">
          <span class="text-2xl">🛠️</span>
          <span class="text-xl font-bold text-gradient">办公工具箱</span>
        </div>
        
        <div class="hidden md:flex items-center space-x-1">
          <button
            v-for="cat in categories"
            :key="cat.id"
            @click="navigateTo(cat.id)"
            class="px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-gray-100"
            :class="{ 'bg-primary-100 text-primary-600': currentCategory === cat.id }"
          >
            <span class="mr-1">{{ cat.icon }}</span>
            {{ cat.name }}
          </button>
        </div>
        
        <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden p-2 rounded-lg hover:bg-gray-100">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      <div v-if="mobileMenuOpen" class="md:hidden pb-4">
        <div class="flex flex-col space-y-1">
          <button
            v-for="cat in categories"
            :key="cat.id"
            @click="navigateTo(cat.id); mobileMenuOpen = false"
            class="px-3 py-2 rounded-lg text-left text-sm font-medium transition-colors duration-200 hover:bg-gray-100"
            :class="{ 'bg-primary-100 text-primary-600': currentCategory === cat.id }"
          >
            <span class="mr-2">{{ cat.icon }}</span>
            {{ cat.name }}
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getCategories } from '../router'

const router = useRouter()
const route = useRoute()
const mobileMenuOpen = ref(false)

const categories = getCategories()

const currentCategory = computed(() => {
  return route.params.category || ''
})

function navigateTo(category) {
  if (route.params.category === category) {
    router.push('/')
  } else {
    router.push(`/${category}`)
  }
}
</script>
