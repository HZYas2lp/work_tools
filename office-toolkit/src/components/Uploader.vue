<template>
  <div
    class="uploader-container"
    :class="{ 'border-primary-500 border-dashed': isDragging }"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="handleDrop"
    @click="triggerFileInput"
  >
    <input
      ref="fileInput"
      type="file"
      :accept="accept"
      :multiple="multiple"
      class="hidden"
      @change="handleFileSelect"
    />
    
    <div class="flex flex-col items-center justify-center py-8 px-4">
      <div class="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
        <svg class="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>
      <p class="text-lg font-medium text-gray-700 mb-2">{{ title }}</p>
      <p class="text-sm text-gray-500 mb-4">{{ hint }}</p>
      <button type="button" class="btn-primary">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        选择文件
      </button>
    </div>
    
    <div v-if="files.length > 0" class="mt-4 space-y-2">
      <div
        v-for="(file, index) in files"
        :key="index"
        class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
      >
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
            <span class="text-lg">{{ getFileIcon(file.type) }}</span>
          </div>
          <div>
            <p class="font-medium text-gray-700 text-sm truncate max-w-xs">{{ file.name }}</p>
            <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
          </div>
        </div>
        <button @click.stop="removeFile(index)" class="text-gray-400 hover:text-danger transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '点击或拖拽上传文件'
  },
  hint: {
    type: String,
    default: '支持多种文件格式，所有数据本地处理'
  },
  accept: {
    type: String,
    default: '*'
  },
  multiple: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['files-selected'])

const fileInput = ref(null)
const isDragging = ref(false)
const files = ref([])

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileSelect(event) {
  const selectedFiles = Array.from(event.target.files)
  if (props.multiple) {
    files.value = [...files.value, ...selectedFiles]
  } else {
    files.value = selectedFiles
  }
  emit('files-selected', files.value)
}

function handleDrop(event) {
  isDragging.value = false
  const droppedFiles = Array.from(event.dataTransfer.files)
  if (props.multiple) {
    files.value = [...files.value, ...droppedFiles]
  } else {
    files.value = droppedFiles
  }
  emit('files-selected', files.value)
}

function removeFile(index) {
  files.value.splice(index, 1)
  emit('files-selected', files.value)
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

function clearFiles() {
  files.value = []
  emit('files-selected', [])
}

defineExpose({ files, clearFiles })
</script>

<style scoped>
.uploader-container {
  @apply border-2 border-dashed border-gray-300 rounded-xl bg-white transition-all duration-200 cursor-pointer;
}

.uploader-container:hover {
  @apply border-primary-300;
}

.uploader-container.border-primary-500 {
  @apply bg-primary-50;
}
</style>
