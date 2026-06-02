<template>
  <footer class="bg-white border-t border-gray-200 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <div class="flex items-center space-x-2 text-gray-600">
          <span class="text-lg">🛠️</span>
          <span class="font-medium">办公工具箱</span>
        </div>
        <div class="text-gray-500 text-sm mt-4 md:mt-0">
          <p>所有数据均在本地处理，不上传服务器</p>
        </div>
        <div class="text-gray-400 text-sm mt-4 md:mt-0">
          © {{ currentYear }} Office Toolkit
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>
