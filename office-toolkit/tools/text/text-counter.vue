<template>
  <div class="tool-page">
    <div class="mb-8">
      <div class="flex items-center space-x-3 mb-2">
        <div class="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
          <span class="text-2xl">{{ meta.icon }}</span>
        </div>
        <div>
          <h1 class="text-xl font-bold text-gray-900">{{ meta.title }}</h1>
          <p class="text-gray-500">{{ meta.description }}</p>
        </div>
      </div>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 card p-6">
        <h2 class="font-semibold text-gray-900 mb-4">输入文本</h2>
        <textarea
          v-model="text"
          class="input-field h-64 resize-none"
          placeholder="在这里输入文本..."
        ></textarea>
        
        <div class="flex space-x-2 mt-4">
          <button @click="clearText" class="btn-secondary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            清空
          </button>
          <button @click="copyText" class="btn-primary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {{ copied ? '已复制' : '复制文本' }}
          </button>
        </div>
      </div>
      
      <div class="card p-6">
        <h2 class="font-semibold text-gray-900 mb-4">统计结果</h2>
        
        <div class="space-y-4">
          <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span class="text-gray-600">字符数（含空格）</span>
            <span class="text-2xl font-bold text-primary-600">{{ stats.charactersWithSpaces }}</span>
          </div>
          
          <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span class="text-gray-600">字符数（不含空格）</span>
            <span class="text-2xl font-bold text-primary-600">{{ stats.charactersWithoutSpaces }}</span>
          </div>
          
          <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span class="text-gray-600">字数（中文）</span>
            <span class="text-2xl font-bold text-primary-600">{{ stats.chineseChars }}</span>
          </div>
          
          <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span class="text-gray-600">单词数</span>
            <span class="text-2xl font-bold text-primary-600">{{ stats.words }}</span>
          </div>
          
          <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span class="text-gray-600">行数</span>
            <span class="text-2xl font-bold text-primary-600">{{ stats.lines }}</span>
          </div>
          
          <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span class="text-gray-600">段落数</span>
            <span class="text-2xl font-bold text-primary-600">{{ stats.paragraphs }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const meta = {
  title: '字数统计',
  description: '统计文本的字符数、字数、单词数、行数等信息',
  icon: '📝'
}

const text = ref('')
const copied = ref(false)

const stats = computed(() => {
  const content = text.value
  
  const charactersWithSpaces = content.length
  
  const charactersWithoutSpaces = content.replace(/\s/g, '').length
  
  const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) || []).length
  
  const words = content.trim() ? content.trim().split(/\s+/).length : 0
  
  const lines = content ? content.split('\n').length : 0
  
  const paragraphs = content.trim() ? content.trim().split(/\n\n+/).length : 0
  
  return {
    charactersWithSpaces,
    charactersWithoutSpaces,
    chineseChars,
    words,
    lines,
    paragraphs
  }
})

function clearText() {
  text.value = ''
}

async function copyText() {
  if (!text.value) return
  
  try {
    await navigator.clipboard.writeText(text.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
  }
}
</script>

<style scoped>
.tool-page {
  min-height: 60vh;
}
</style>
