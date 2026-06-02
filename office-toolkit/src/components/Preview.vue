<template>
  <div class="preview-container">
    <div v-if="!file" class="flex flex-col items-center justify-center py-12 text-gray-400">
      <svg class="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
      <p>暂无预览内容</p>
    </div>
    
    <template v-else-if="isImage">
      <div class="relative bg-gray-900 rounded-lg overflow-hidden">
        <img
          :src="fileUrl"
          :alt="file.name"
          class="max-w-full max-h-96 object-contain mx-auto"
          @error="handleImageError"
        />
        <div class="absolute top-2 right-2 flex space-x-2">
          <button @click="zoomIn" class="p-2 bg-black/50 rounded-lg text-white hover:bg-black/70 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
            </svg>
          </button>
          <button @click="zoomOut" class="p-2 bg-black/50 rounded-lg text-white hover:bg-black/70 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
            </svg>
          </button>
          <button @click="resetZoom" class="p-2 bg-black/50 rounded-lg text-white hover:bg-black/70 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
        </div>
      </div>
    </template>
    
    <template v-else-if="isText">
      <div class="bg-gray-900 rounded-lg p-4">
        <pre class="text-gray-100 text-sm whitespace-pre-wrap max-h-96 overflow-auto">{{ textContent }}</pre>
      </div>
    </template>
    
    <template v-else-if="isPdf">
      <div class="flex flex-col items-center justify-center py-12 bg-gray-100 rounded-lg">
        <span class="text-6xl mb-4">📄</span>
        <p class="text-gray-600 font-medium">{{ file.name }}</p>
        <p class="text-gray-400 text-sm mt-1">PDF预览需要浏览器支持</p>
        <object
          :data="fileUrl"
          type="application/pdf"
          class="w-full h-96 mt-4"
        >
          <p class="text-center text-gray-500">您的浏览器不支持PDF预览</p>
        </object>
      </div>
    </template>
    
    <template v-else>
      <div class="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
        <div class="w-20 h-20 rounded-xl bg-gray-200 flex items-center justify-center mb-4">
          <span class="text-4xl">{{ getFileIcon(file.type) }}</span>
        </div>
        <p class="text-gray-700 font-medium">{{ file.name }}</p>
        <p class="text-gray-500 text-sm mt-1">{{ formatFileSize(file.size) }}</p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  file: {
    type: File,
    default: null
  }
})

const fileUrl = ref('')
const textContent = ref('')
const zoom = ref(1)

const isImage = computed(() => props.file?.type?.startsWith('image/'))
const isText = computed(() => props.file?.type?.startsWith('text/') || ['application/json', 'application/javascript', 'application/xml'].includes(props.file?.type))
const isPdf = computed(() => props.file?.type === 'application/pdf')

watch(() => props.file, (newFile) => {
  if (newFile) {
    fileUrl.value = URL.createObjectURL(newFile)
    zoom.value = 1
    
    if (isText.value) {
      const reader = new FileReader()
      reader.onload = (e) => {
        textContent.value = e.target.result
      }
      reader.readAsText(newFile)
    }
  } else {
    fileUrl.value = ''
    textContent.value = ''
  }
}, { immediate: true })

function handleImageError() {
  console.error('Failed to load image')
}

function zoomIn() {
  zoom.value = Math.min(zoom.value + 0.25, 3)
}

function zoomOut() {
  zoom.value = Math.max(zoom.value - 0.25, 0.25)
}

function resetZoom() {
  zoom.value = 1
}

function getFileIcon(mimeType) {
  if (mimeType?.includes('image')) return '🖼️'
  if (mimeType?.includes('pdf')) return '📄'
  if (mimeType?.includes('excel') || mimeType?.includes('spreadsheet')) return '📊'
  if (mimeType?.includes('text')) return '📝'
  return '📎'
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}
</script>

<style scoped>
.preview-container {
  img {
    transform: scale(var(--zoom, 1));
    transition: transform 0.2s ease;
  }
}
</style>
