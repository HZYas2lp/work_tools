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
        <h2 class="font-semibold text-gray-900 mb-4">上传 Excel 文件</h2>
        <Uploader
          ref="uploader"
          title="点击或拖拽上传 Excel 文件"
          hint="支持 .xlsx、.xls 格式"
          accept=".xlsx,.xls"
          @files-selected="handleFilesSelected"
        />
        
        <button
          v-if="files.length > 0"
          @click="convert"
          class="btn-primary w-full mt-4"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          转换为 CSV
        </button>
      </div>
      
      <div class="card p-6">
        <h2 class="font-semibold text-gray-900 mb-4">预览结果</h2>
        <div v-if="!csvContent" class="flex flex-col items-center justify-center py-12 text-gray-400">
          <svg class="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>转换结果将在这里显示</p>
        </div>
        
        <div v-else class="bg-gray-50 rounded-lg p-4">
          <pre class="text-sm text-gray-700 whitespace-pre-wrap max-h-64 overflow-auto">{{ csvContent }}</pre>
        </div>
        
        <DownloadButton
          v-if="csvContent"
          label="下载 CSV"
          @click="downloadCsv"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Uploader from '../../src/components/Uploader.vue'
import DownloadButton from '../../src/components/DownloadButton.vue'

const meta = {
  title: 'Excel 转 CSV',
  description: '将 Excel 文件转换为 CSV 格式，方便数据处理和导入',
  icon: '📊'
}

const uploader = ref(null)
const files = ref([])
const csvContent = ref('')

function handleFilesSelected(selectedFiles) {
  files.value = selectedFiles
}

async function convert() {
  if (files.value.length === 0) return
  
  const file = files.value[0]
  
  try {
    csvContent.value = await parseExcel(file)
  } catch (error) {
    console.error('转换失败:', error)
  }
}

async function parseExcel(file) {
  const reader = new FileReader()
  
  return new Promise((resolve, reject) => {
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result)
      
      if (file.name.endsWith('.csv')) {
        const text = new TextDecoder('utf-8').decode(data)
        resolve(text)
      } else {
        try {
          const csv = convertXlsxToCsv(data)
          resolve(csv)
        } catch (e) {
          reject(e)
        }
      }
    }
    
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

function convertXlsxToCsv(data) {
  const zip = new Uint8Array(data)
  const xmlContent = findXmlContent(zip, 'xl/worksheets/sheet1.xml')
  
  if (!xmlContent) {
    return '无法解析 Excel 文件，请确保文件格式正确'
  }
  
  return parseSheetXml(xmlContent)
}

function findXmlContent(zip, path) {
  const signature = new Uint8Array([80, 75, 3, 4])
  
  for (let i = 0; i < zip.length - 3; i++) {
    if (zip[i] === signature[0] && 
        zip[i+1] === signature[1] && 
        zip[i+2] === signature[2] && 
        zip[i+3] === signature[3]) {
      const fileNameLength = zip[i + 26] + (zip[i + 27] << 8)
      const fileName = new TextDecoder('utf-8').decode(zip.slice(i + 30, i + 30 + fileNameLength))
      
      if (fileName.includes(path)) {
        const compressedSize = zip[i + 18] + (zip[i + 19] << 8) + (zip[i + 20] << 16) + (zip[i + 21] << 24)
        const fileData = zip.slice(i + 30 + fileNameLength, i + 30 + fileNameLength + compressedSize)
        
        try {
          const decompressed = decompress(fileData)
          return new TextDecoder('utf-8').decode(decompressed)
        } catch (e) {
          console.warn('Failed to decompress:', e)
        }
      }
    }
  }
  
  return null
}

function decompress(data) {
  const inflate = (input) => {
    const inputBuffer = new Uint8Array(input)
    const output = []
    let i = 0
    
    while (i < inputBuffer.length) {
      const byte = inputBuffer[i++]
      
      if ((byte & 0x0F) === 0x08) {
        const len = (byte >> 4) | ((inputBuffer[i] & 0x0F) << 4)
        const dist = ((inputBuffer[i] >> 4) & 0x0F) | (inputBuffer[i + 1] << 4)
        i += 2
        
        for (let j = 0; j < len; j++) {
          output.push(output[output.length - dist])
        }
      } else {
        output.push(byte)
      }
    }
    
    return new Uint8Array(output)
  }
  
  return inflate(data)
}

function parseSheetXml(xml) {
  const rows = xml.match(/<row[^>]*>[\s\S]*?<\/row>/g) || []
  const csvRows = []
  
  rows.forEach(row => {
    const cells = row.match(/<c[^>]*>[\s\S]*?<\/c>/g) || []
    const rowValues = []
    
    cells.forEach(cell => {
      const tMatch = cell.match(/t="([^"]+)"/)
      const isString = tMatch && tMatch[1] === 's'
      
      const vMatch = cell.match(/<v>([^<]+)<\/v>/)
      if (vMatch) {
        let value = vMatch[1]
        
        if (isString) {
          const stringMatch = xml.match(new RegExp(`<si><t>([^<]+)</t></si>`, 'g'))
          if (stringMatch && value >= 0 && value < stringMatch.length) {
            const strXml = stringMatch[value]
            const strMatch = strXml.match(/<t>([^<]+)<\/t>/)
            value = strMatch ? strMatch[1] : value
          }
        }
        
        rowValues.push(escapeCsv(value))
      } else {
        rowValues.push('')
      }
    })
    
    csvRows.push(rowValues.join(','))
  })
  
  return csvRows.join('\n')
}

function escapeCsv(value) {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function downloadCsv() {
  if (!csvContent.value) return
  
  const blob = new Blob([csvContent.value], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'converted.csv'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.tool-page {
  min-height: 60vh;
}
</style>
