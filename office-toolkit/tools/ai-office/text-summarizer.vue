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
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card p-6">
        <h2 class="font-semibold text-gray-900 mb-4">输入文本</h2>
        <textarea
          v-model="inputText"
          class="input-field h-64 resize-none"
          placeholder="在这里输入需要总结的文本..."
        ></textarea>
        
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">总结长度</label>
          <div class="flex items-center space-x-4">
            <input
              v-model="summaryLength"
              type="range"
              min="50"
              max="500"
              step="50"
              class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span class="text-sm font-medium text-gray-700 w-16 text-right">{{ summaryLength }} 字</span>
          </div>
        </div>
        
        <button
          @click="summarize"
          :disabled="loading || !inputText.trim()"
          class="btn-primary w-full mt-4"
        >
          <svg v-if="loading" class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          {{ loading ? '总结中...' : '生成总结' }}
        </button>
      </div>
      
      <div class="card p-6">
        <h2 class="font-semibold text-gray-900 mb-4">总结结果</h2>
        
        <div v-if="!summary" class="flex flex-col items-center justify-center py-12 text-gray-400">
          <svg class="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>总结结果将在这里显示</p>
        </div>
        
        <div v-else class="bg-gray-50 rounded-lg p-4">
          <p class="text-gray-700 whitespace-pre-wrap">{{ summary }}</p>
        </div>
        
        <div v-if="summary" class="mt-4 flex space-x-2">
          <button @click="copySummary" class="btn-secondary flex-1">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            复制
          </button>
          <button @click="clearSummary" class="btn-secondary flex-1">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            清空
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const meta = {
  title: '文本总结',
  description: '智能总结长文本内容，提取关键信息',
  icon: '🤖'
}

const inputText = ref('')
const summaryLength = ref(150)
const summary = ref('')
const loading = ref(false)

async function summarize() {
  if (!inputText.value.trim()) return
  
  loading.value = true
  summary.value = ''
  
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const text = inputText.value
  const sentences = text.split(/[。！？\n]/).filter(s => s.trim())
  
  const summarySentences = []
  let currentLength = 0
  
  sentences.forEach(sentence => {
    if (currentLength + sentence.length < summaryLength.value) {
      summarySentences.push(sentence.trim())
      currentLength += sentence.length + 1
    }
  })
  
  if (summarySentences.length === 0 && sentences.length > 0) {
    summary.value = sentences[0].substring(0, summaryLength.value) + '...'
  } else {
    summary.value = summarySentences.join('。') + '。'
  }
  
  loading.value = false
}

async function copySummary() {
  if (!summary.value) return
  
  try {
    await navigator.clipboard.writeText(summary.value)
    alert('已复制到剪贴板')
  } catch (err) {
    console.error('复制失败:', err)
  }
}

function clearSummary() {
  inputText.value = ''
  summary.value = ''
}
</script>

<style scoped>
.tool-page {
  min-height: 60vh;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
}
</style>
