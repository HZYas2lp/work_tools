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
        <h2 class="font-semibold text-gray-900 mb-4">上传图片</h2>
        <Uploader
          ref="uploader"
          title="点击或拖拽上传图片"
          hint="支持 JPG、PNG、WebP 格式"
          accept="image/*"
          @files-selected="handleFilesSelected"
        />
        
        <div v-if="files.length > 0" class="mt-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">宽度 (px)</label>
              <input
                v-model.number="width"
                type="number"
                class="input-field"
                placeholder="宽度"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">高度 (px)</label>
              <input
                v-model.number="height"
                type="number"
                class="input-field"
                placeholder="高度"
              />
            </div>
          </div>
          
          <div class="mt-4">
            <label class="flex items-center space-x-2">
              <input
                v-model="maintainAspect"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span class="text-sm text-gray-700">保持宽高比</span>
            </label>
          </div>
          
          <button @click="resize" class="btn-primary w-full mt-4">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            调整尺寸
          </button>
        </div>
      </div>
      
      <div class="card p-6">
        <h2 class="font-semibold text-gray-900 mb-4">预览</h2>
        <Preview :file="files[0]" />
        
        <div v-if="resizedImage" class="mt-4">
          <div class="bg-gray-50 rounded-lg p-4">
            <img :src="resizedImage" alt="调整后的图片" class="max-w-full rounded-lg" />
          </div>
          
          <DownloadButton
            label="下载调整后的图片"
            @click="downloadImage"
            class="mt-4"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Uploader from '../../src/components/Uploader.vue'
import Preview from '../../src/components/Preview.vue'
import DownloadButton from '../../src/components/DownloadButton.vue'

const meta = {
  title: '图片尺寸调整',
  description: '调整图片尺寸，支持自定义宽高，保持比例',
  icon: '🖼️'
}

const uploader = ref(null)
const files = ref([])
const width = ref(800)
const height = ref(600)
const maintainAspect = ref(true)
const resizedImage = ref(null)

function handleFilesSelected(selectedFiles) {
  files.value = selectedFiles
  resizedImage.value = null
  
  if (selectedFiles.length > 0) {
    const img = new Image()
    img.onload = () => {
      width.value = img.width
      height.value = img.height
    }
    img.src = URL.createObjectURL(selectedFiles[0])
  }
}

async function resize() {
  if (files.value.length === 0) return
  
  const file = files.value[0]
  const img = new Image()
  
  img.onload = () => {
    let targetWidth = width.value
    let targetHeight = height.value
    
    if (maintainAspect.value) {
      const ratio = img.width / img.height
      if (targetWidth / targetHeight > ratio) {
        targetWidth = targetHeight * ratio
      } else {
        targetHeight = targetWidth / ratio
      }
    }
    
    const canvas = document.createElement('canvas')
    canvas.width = targetWidth
    canvas.height = targetHeight
    
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight)
    
    resizedImage.value = canvas.toDataURL(file.type || 'image/jpeg', 0.9)
  }
  
  img.src = URL.createObjectURL(file)
}

function downloadImage() {
  if (!resizedImage.value) return
  
  const link = document.createElement('a')
  link.href = resizedImage.value
  link.download = `resized_${Date.now()}.jpg`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<style scoped>
.tool-page {
  min-height: 60vh;
}
</style>
