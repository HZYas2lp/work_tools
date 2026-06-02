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
        <h2 class="font-semibold text-gray-900 mb-4">上传 PDF 文件</h2>
        <Uploader
          ref="uploader"
          title="点击或拖拽上传 PDF 文件"
          hint="支持多个 PDF 文件，按顺序合并"
          accept=".pdf"
          :multiple="true"
          @files-selected="handleFilesSelected"
        />
        
        <div v-if="files.length > 1" class="mt-4">
          <button @click="merge" class="btn-primary w-full">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            合并 PDF
          </button>
        </div>
      </div>
      
      <div class="card p-6">
        <h2 class="font-semibold text-gray-900 mb-4">合并结果</h2>
        <div v-if="!mergedPdf" class="flex flex-col items-center justify-center py-12 text-gray-400">
          <svg class="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>合并后的 PDF 将在这里预览</p>
        </div>
        
        <div v-else>
          <object
            :data="mergedPdf"
            type="application/pdf"
            class="w-full h-64 bg-gray-100 rounded-lg"
          >
            <p class="text-center text-gray-500 py-8">您的浏览器不支持 PDF 预览</p>
          </object>
          
          <DownloadButton
            label="下载合并后的 PDF"
            @click="downloadPdf"
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
import DownloadButton from '../../src/components/DownloadButton.vue'

const meta = {
  title: 'PDF 合并',
  description: '将多个 PDF 文件合并为一个，支持调整顺序',
  icon: '📄'
}

const uploader = ref(null)
const files = ref([])
const mergedPdf = ref(null)

function handleFilesSelected(selectedFiles) {
  files.value = selectedFiles
}

async function merge() {
  if (files.value.length < 2) return
  
  try {
    const pdfArrayBuffers = await Promise.all(
      files.value.map(file => readFileAsArrayBuffer(file))
    )
    
    const mergedBuffer = await mergePdfs(pdfArrayBuffers)
    mergedPdf.value = URL.createObjectURL(new Blob([mergedBuffer], { type: 'application/pdf' }))
  } catch (error) {
    console.error('合并失败:', error)
  }
}

function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

async function mergePdfs(pdfBuffers) {
  const pdfDocs = pdfBuffers.map(buffer => parsePdf(buffer))
  
  const merged = {
    headers: [],
    body: []
  }
  
  pdfDocs.forEach((doc, index) => {
    if (index === 0) {
      merged.headers = doc.headers
    }
    
    merged.body = [...merged.body, ...doc.body]
  })
  
  merged.headers.forEach(header => {
    if (header.key === '/Pages') {
      const pagesRef = header.value.match(/(\d+) (\d+) R/)[1]
      header.value = header.value.replace(/\/Count \d+/, `/Count ${merged.body.length}`)
    }
  })
  
  return buildPdf(merged)
}

function parsePdf(buffer) {
  const pdf = new Uint8Array(buffer)
  const text = new TextDecoder('utf-8').decode(pdf)
  
  const headerMatch = text.match(/(%PDF-[\d.]+)/)
  const xrefMatch = text.match(/xref\s+(\d+)\s+(\d+)/)
  const eofMatch = text.match(/%%EOF/)
  
  const headers = []
  const body = []
  
  const lines = text.split('\n')
  let inHeader = true
  
  lines.forEach(line => {
    if (line.startsWith('xref')) {
      inHeader = false
    }
    if (inHeader && !line.startsWith('%')) {
      const parts = line.split(/\s+/)
      if (parts.length >= 2) {
        headers.push({ key: parts[0], value: parts.slice(1).join(' ') })
      }
    }
  })
  
  return { headers, body: [] }
}

function buildPdf(merged) {
  const lines = []
  
  lines.push('%PDF-1.7')
  
  merged.headers.forEach(header => {
    lines.push(`${header.key} ${header.value}`)
  })
  
  lines.push('xref')
  lines.push(`0 ${merged.body.length + 1}`)
  lines.push('0000000000 65535 f ')
  
  let offset = 0
  merged.body.forEach((obj, i) => {
    const objStr = `${i + 1} 0 obj\n<<\n>>\nendobj`
    lines.push(objStr.padStart(10, '0') + ` 00000 n `)
    offset += objStr.length + 2
  })
  
  lines.push('trailer')
  lines.push('<<')
  lines.push('/Size ' + (merged.body.length + 1))
  lines.push('>>')
  lines.push('startxref')
  lines.push(offset)
  lines.push('%%EOF')
  
  return new TextEncoder().encode(lines.join('\n'))
}

function downloadPdf() {
  if (!mergedPdf.value) return
  
  const link = document.createElement('a')
  link.href = mergedPdf.value
  link.download = 'merged.pdf'
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
