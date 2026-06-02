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

    <div class="card p-6 mb-6">
      <h2 class="font-semibold text-gray-900 mb-4">选择比对方式</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          @click="selectMode('single')"
          class="p-4 border-2 rounded-xl cursor-pointer transition-all"
          :class="mode === 'single' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300'"
        >
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
              <span class="text-xl">📄</span>
            </div>
            <div>
              <h3 class="font-medium text-gray-900">单文件多工作表</h3>
              <p class="text-sm text-gray-500">一个 Excel 文件中选择两个工作表进行比对</p>
            </div>
          </div>
        </div>

        <div
          @click="selectMode('double')"
          class="p-4 border-2 rounded-xl cursor-pointer transition-all"
          :class="mode === 'double' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300'"
        >
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
              <span class="text-xl">📁</span>
            </div>
            <div>
              <h3 class="font-medium text-gray-900">双文件比对</h3>
              <p class="text-sm text-gray-500">分别上传两个文件，选择各自的工作表进行比对</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="mode" class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div class="card p-6">
        <h2 class="font-semibold text-gray-900 mb-4">
          {{ mode === 'single' ? '上传文件' : '主表文件' }}
        </h2>
        <div
          ref="mainDropZone"
          @dragover.prevent="isMainDragging = true"
          @dragleave.prevent="isMainDragging = false"
          @drop.prevent="handleMainDrop"
          @click="triggerMainInput"
          class="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all"
          :class="isMainDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'"
        >
          <input
            ref="mainFileInput"
            type="file"
            accept=".xlsx,.xls,.csv"
            class="hidden"
            @change="handleMainFileSelect"
          />
          <div v-if="!mainFile" class="flex flex-col items-center">
            <div class="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p class="text-gray-700 font-medium mb-2">拖拽文件到此处，或点击选择</p>
            <p class="text-sm text-gray-500">支持 .xlsx、.xls、.csv 格式</p>
          </div>
          <div v-else class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <span class="text-lg">📊</span>
              </div>
              <div class="text-left">
                <p class="font-medium text-gray-700">{{ mainFile.name }}</p>
                <p class="text-sm text-gray-500">{{ formatFileSize(mainFile.size) }}</p>
              </div>
            </div>
            <button @click.stop="clearMainFile" class="text-gray-400 hover:text-danger">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div v-if="mainSheets.length > 0" class="mt-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">选择作为主表的工作表</label>
          <select v-model="mainSheetIndex" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option v-for="(sheet, index) in mainSheets" :key="index" :value="index">
              {{ sheet.name }} ({{ sheet.rowCount }} 行)
            </option>
          </select>
        </div>
      </div>

      <div v-if="mode === 'double'" class="card p-6">
        <h2 class="font-semibold text-gray-900 mb-4">参照表文件</h2>
        <div
          ref="refDropZone"
          @dragover.prevent="isRefDragging = true"
          @dragleave.prevent="isRefDragging = false"
          @drop.prevent="handleRefDrop"
          @click="triggerRefInput"
          class="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all"
          :class="isRefDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'"
        >
          <input
            ref="refFileInput"
            type="file"
            accept=".xlsx,.xls,.csv"
            class="hidden"
            @change="handleRefFileSelect"
          />
          <div v-if="!refFile" class="flex flex-col items-center">
            <div class="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p class="text-gray-700 font-medium mb-2">拖拽文件到此处，或点击选择</p>
            <p class="text-sm text-gray-500">支持 .xlsx、.xls、.csv 格式</p>
          </div>
          <div v-else class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <span class="text-lg">📊</span>
              </div>
              <div class="text-left">
                <p class="font-medium text-gray-700">{{ refFile.name }}</p>
                <p class="text-sm text-gray-500">{{ formatFileSize(refFile.size) }}</p>
              </div>
            </div>
            <button @click.stop="clearRefFile" class="text-gray-400 hover:text-danger">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div v-if="refSheets.length > 0 && mode === 'double'" class="mt-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">选择作为参照表的工作表</label>
          <select v-model="refSheetIndex" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option v-for="(sheet, index) in refSheets" :key="index" :value="index">
              {{ sheet.name }} ({{ sheet.rowCount }} 行)
            </option>
          </select>
        </div>
      </div>

      <div v-if="mode === 'single' && mainSheets.length > 0" class="card p-6">
        <h2 class="font-semibold text-gray-900 mb-4">选择参照表工作表</h2>
        <div v-if="mainSheets.length < 2" class="text-center py-8 text-gray-500">
          <svg class="w-12 h-12 mx-auto mb-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p>该文件只有 {{ mainSheets.length }} 个工作表</p>
          <p class="text-sm mt-1">至少需要 2 个工作表才能进行比对</p>
        </div>
        <div v-else>
          <select v-model="refSheetIndex" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option v-for="(sheet, index) in mainSheets" :key="index" :value="index" :disabled="index === mainSheetIndex">
              {{ sheet.name }} ({{ sheet.rowCount }} 行) {{ index === mainSheetIndex ? '- 主表' : '' }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="canProceed" class="card p-6 mb-6">
      <h2 class="font-semibold text-gray-900 mb-4">匹配设置</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            公共列（用于匹配的关键列）
          </label>
          <p class="text-xs text-gray-500 mb-2">主表和参照表中用于匹配的列</p>
          <select v-model="mainMatchColumn" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option value="">请选择</option>
            <option v-for="col in commonColumns" :key="col" :value="col">{{ col }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            匹配列（从参照表获取的列）
          </label>
          <p class="text-xs text-gray-500 mb-2">按住 Ctrl/Cmd 可多选</p>
          <select v-model="selectedReturnColumns" multiple class="w-full px-3 py-2 border border-gray-300 rounded-lg h-24">
            <option v-for="col in refColumns" :key="col" :value="col">{{ col }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">匹配方式</label>
          <select v-model="matchMode" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option value="exact">精确匹配（完全相等）</option>
            <option value="fuzzy">模糊匹配（包含关系）</option>
            <option value="regex">正则匹配（自定义规则）</option>
          </select>
        </div>

        <div v-if="matchMode === 'regex'">
          <label class="block text-sm font-medium text-gray-700 mb-2">正则表达式</label>
          <input 
            v-model="regexPattern" 
            type="text" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="例如: .*关键词.* 或 ^ABC.*"
          />
          <p class="text-xs text-gray-500 mt-1">参照表的值会作为正则表达式匹配</p>
        </div>
      </div>

      <button
        @click="executeMatch"
        class="btn-primary mt-6 w-full md:w-auto"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        执行匹配
      </button>
    </div>

    <div v-if="resultData" class="card p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-semibold text-gray-900">匹配结果</h2>
        <div class="flex items-center space-x-4">
          <div class="text-sm text-gray-500">
            <span class="text-green-600 font-medium">{{ matchCount }}</span> 匹配成功，
            <span class="text-red-500 font-medium">{{ resultData.length - matchCount }}</span> 未匹配
          </div>
          <DownloadButton label="导出结果" @click="downloadResult" />
        </div>
      </div>

      <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <p class="text-sm text-green-700">
          <strong>主表：</strong>{{ mainSheetName }} &nbsp;|&nbsp;
          <strong>参照表：</strong>{{ refSheetName }} &nbsp;|&nbsp;
          <strong>匹配列：</strong>{{ mainMatchColumn }} &nbsp;|&nbsp;
          <strong>获取列：</strong>{{ selectedReturnColumns.join(', ') }}
        </p>
      </div>
      
      <div class="overflow-x-auto max-h-96">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50 sticky top-0">
            <tr>
              <th v-for="col in resultColumns" :key="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ col }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(row, index) in resultData" :key="index" :class="isRowMatched(row) ? '' : 'bg-red-50'">
              <td v-for="col in resultColumns" :key="col" class="px-4 py-3 text-sm text-gray-900">
                {{ row[col] || '' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Loading v-if="loading" />
    <ErrorMessage v-if="error" :message="error" @close="error = null" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import DownloadButton from '../../src/components/DownloadButton.vue'
import Loading from '../../src/components/Loading.vue'
import ErrorMessage from '../../src/components/ErrorMessage.vue'

const meta = {
  title: 'Excel 列匹配',
  description: '类似 VLOOKUP 功能，支持多工作表/多文件之间的精准、模糊、正则匹配',
  icon: '🔍'
}

const mode = ref('')
const mainFile = ref(null)
const refFile = ref(null)
const mainSheets = ref([])
const refSheets = ref([])
const mainSheetIndex = ref(0)
const refSheetIndex = ref(0)
const mainData = ref(null)
const refData = ref(null)
const mainMatchColumn = ref('')
const selectedReturnColumns = ref([])
const matchMode = ref('exact')
const regexPattern = ref('')
const resultData = ref(null)
const matchCount = ref(0)
const loading = ref(false)
const error = ref(null)
const isMainDragging = ref(false)
const isRefDragging = ref(false)
const mainDropZone = ref(null)
const refDropZone = ref(null)
const mainFileInput = ref(null)
const refFileInput = ref(null)

const mainSheetName = computed(() => mainSheets.value[mainSheetIndex.value]?.name || '')
const refSheetName = computed(() => {
  if (mode.value === 'single') {
    return mainSheets.value[refSheetIndex.value]?.name || ''
  }
  return refSheets.value[refSheetIndex.value]?.name || ''
})

const commonColumns = computed(() => {
  if (!mainData.value || !refData.value) return []
  const mainCols = Object.keys(mainData.value[0] || {})
  const refCols = Object.keys(refData.value[0] || {})
  return mainCols.filter(col => refCols.includes(col))
})

const refColumns = computed(() => {
  if (!refData.value || refData.value.length === 0) return []
  return Object.keys(refData.value[0])
})

const resultColumns = computed(() => {
  if (!mainData.value || !selectedReturnColumns.value) return []
  const mainCols = Object.keys(mainData.value[0])
  const newCols = selectedReturnColumns.value.map(col => {
    if (mainCols.includes(col)) {
      return `${col}_参照`
    }
    return col
  })
  return [...mainCols, ...newCols]
})

const canProceed = computed(() => {
  if (mode.value === 'single') {
    return mainFile.value && mainSheets.value.length >= 2 && refSheetIndex.value !== mainSheetIndex.value
  }
  return mainFile.value && refFile.value
})

function selectMode(selectedMode) {
  mode.value = selectedMode
  resetData()
}

function resetData() {
  mainFile.value = null
  refFile.value = null
  mainSheets.value = []
  refSheets.value = []
  mainSheetIndex.value = 0
  refSheetIndex.value = 0
  mainData.value = null
  refData.value = null
  mainMatchColumn.value = ''
  selectedReturnColumns.value = []
  resultData.value = null
  matchCount.value = 0
}

function triggerMainInput() {
  mainFileInput.value?.click()
}

function triggerRefInput() {
  refFileInput.value?.click()
}

function handleMainDrop(e) {
  isMainDragging.value = false
  const files = e.dataTransfer.files
  if (files.length > 0) {
    handleMainFile(files[0])
  }
}

function handleRefDrop(e) {
  isRefDragging.value = false
  const files = e.dataTransfer.files
  if (files.length > 0) {
    handleRefFile(files[0])
  }
}

function handleMainFileSelect(e) {
  if (e.target.files && e.target.files[0]) {
    handleMainFile(e.target.files[0])
  }
}

function handleRefFileSelect(e) {
  if (e.target.files && e.target.files[0]) {
    handleRefFile(e.target.files[0])
  }
}

function clearMainFile() {
  mainFile.value = null
  mainSheets.value = []
  mainData.value = null
  resultData.value = null
  mainMatchColumn.value = ''
  selectedReturnColumns.value = []
}

function clearRefFile() {
  refFile.value = null
  refSheets.value = []
  refData.value = null
  resultData.value = null
}

async function handleMainFile(file) {
  loading.value = true
  error.value = null
  
  try {
    mainFile.value = file
    const sheets = await parseFile(file)
    mainSheets.value = sheets
    
    if (sheets.length < 2 && mode.value === 'single') {
      error.value = `该文件只有 ${sheets.length} 个工作表，至少需要 2 个工作表才能进行比对`
      return
    }
    
    if (sheets.length > 0) {
      mainData.value = sheets[0].data
      mainSheetIndex.value = 0
      refSheetIndex.value = sheets.length > 1 ? 1 : 0
      loadRefData()
    }
  } catch (e) {
    error.value = '解析文件失败: ' + e.message
    mainFile.value = null
  } finally {
    loading.value = false
  }
}

async function handleRefFile(file) {
  loading.value = true
  error.value = null
  
  try {
    refFile.value = file
    const sheets = await parseFile(file)
    refSheets.value = sheets
    
    if (sheets.length > 0) {
      refData.value = sheets[0].data
      refSheetIndex.value = 0
    }
  } catch (e) {
    error.value = '解析文件失败: ' + e.message
    refFile.value = null
  } finally {
    loading.value = false
  }
}

watch(mainSheetIndex, () => {
  if (mainSheets.value[mainSheetIndex.value]) {
    mainData.value = mainSheets.value[mainSheetIndex.value].data
    resultData.value = null
    mainMatchColumn.value = ''
    selectedReturnColumns.value = []
  }
})

watch(refSheetIndex, () => {
  loadRefData()
})

function loadRefData() {
  if (mode.value === 'single') {
    refData.value = mainSheets.value[refSheetIndex.value]?.data || null
  } else {
    refData.value = refSheets.value[refSheetIndex.value]?.data || null
  }
  resultData.value = null
  mainMatchColumn.value = ''
  selectedReturnColumns.value = []
}

async function parseFile(file) {
  const reader = new FileReader()
  
  return new Promise((resolve, reject) => {
    reader.onload = async (e) => {
      try {
        const fileName = file.name.toLowerCase()
        let sheets = []
        
        if (fileName.endsWith('.csv')) {
          const text = e.target.result
          const data = parseCsv(text)
          sheets = [{ name: 'Sheet1', data, rowCount: data.length }]
        } else {
          const data = new Uint8Array(e.target.result)
          sheets = await parseExcel(data)
        }
        
        resolve(sheets)
      } catch (err) {
        reject(err)
      }
    }
    
    reader.onerror = () => reject(new Error('文件读取失败'))
    
    if (file.name.toLowerCase().endsWith('.csv')) {
      reader.readAsText(file)
    } else {
      reader.readAsArrayBuffer(file)
    }
  })
}

function parseCsv(text) {
  const lines = text.split('\n').filter(line => line.trim())
  if (lines.length === 0) return []
  
  const headers = parseCsvLine(lines[0])
  const data = []
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i])
    const row = {}
    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })
    data.push(row)
  }
  
  return data
}

function parseCsvLine(line) {
  const result = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"' && !inQuotes) {
      inQuotes = true
    } else if (char === '"' && inQuotes && line[i + 1] === '"') {
      current += '"'
      i++
    } else if (char === '"' && inQuotes) {
      inQuotes = false
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  result.push(current.trim())
  
  return result
}

async function parseExcel(data) {
  const zip = new Uint8Array(data)
  const sharedStrings = parseSharedStrings(zip)
  const sheets = []
  
  for (let i = 1; ; i++) {
    const sheetPath = `xl/worksheets/sheet${i}.xml`
    const xmlContent = findXmlContent(zip, sheetPath)
    
    if (!xmlContent) break
    
    const sheetName = `Sheet${i}`
    const sheetData = parseSheetXml(xmlContent, sharedStrings)
    
    sheets.push({ name: sheetName, data: sheetData, rowCount: sheetData.length })
  }
  
  return sheets
}

function findXmlContent(zip, path) {
  const signature = new Uint8Array([80, 75, 3, 4])
  
  for (let i = 0; i < zip.length - 3; i++) {
    if (zip[i] === signature[0] && zip[i+1] === signature[1] && 
        zip[i+2] === signature[2] && zip[i+3] === signature[3]) {
      const fileNameLength = zip[i + 26] + (zip[i + 27] << 8)
      const fileName = new TextDecoder('utf-8').decode(zip.slice(i + 30, i + 30 + fileNameLength))
      
      if (fileName === path || fileName.includes('/' + path)) {
        const compressedSize = zip[i + 18] + (zip[i + 19] << 8) + (zip[i + 20] << 16) + (zip[i + 21] << 24)
        const fileData = zip.slice(i + 30 + fileNameLength, i + 30 + fileNameLength + compressedSize)
        
        try {
          const decompressed = decompress(fileData)
          return new TextDecoder('utf-8').decode(decompressed)
        } catch (e) {
          console.warn('Decompress failed:', e)
        }
      }
    }
  }
  
  return null
}

function decompress(data) {
  const inputBuffer = new Uint8Array(data)
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

function parseSharedStrings(zip) {
  const content = findXmlContent(zip, 'xl/sharedStrings.xml')
  if (!content) return []
  
  const strings = []
  const pattern = /<t>([^<]*?)<\/t>/g
  let match
  
  while ((match = pattern.exec(content)) !== null) {
    strings.push(match[1])
  }
  
  return strings
}

function parseSheetXml(xml, sharedStrings) {
  const rows = xml.match(/<row[^>]*>[\s\S]*?<\/row>/g) || []
  if (rows.length === 0) return []
  
  const headerRow = rows[0]
  const headerCells = headerRow.match(/<c[^>]*>[\s\S]*?<\/c>/g) || []
  const headers = headerCells.map(cell => parseCellValue(cell, sharedStrings))
  
  const data = []
  
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i]
    const cells = row.match(/<c[^>]*>[\s\S]*?<\/c>/g) || []
    const rowData = {}
    
    cells.forEach((cell) => {
      const headerIndex = getColumnIndex(cell)
      const header = headers[headerIndex] || `Column${headerIndex}`
      rowData[header] = parseCellValue(cell, sharedStrings)
    })
    
    if (Object.keys(rowData).some(key => rowData[key] !== '')) {
      data.push(rowData)
    }
  }
  
  return data
}

function getColumnIndex(cell) {
  const rMatch = cell.match(/r="([A-Z]+)/)
  if (rMatch) {
    const col = rMatch[1]
    let index = 0
    for (let i = 0; i < col.length; i++) {
      index = index * 26 + (col.charCodeAt(i) - 'A'.charCodeAt(0) + 1)
    }
    return index - 1
  }
  return 0
}

function parseCellValue(cell, sharedStrings) {
  const tMatch = cell.match(/t="([^"]+)"/)
  const cellType = tMatch ? tMatch[1] : 'n'
  
  const vMatch = cell.match(/<v>([\s\S]*?)<\/v>/)
  if (vMatch) {
    let value = vMatch[1].trim()
    
    if (cellType === 's' && sharedStrings.length > 0) {
      const idx = parseInt(value)
      if (!isNaN(idx) && idx >= 0 && idx < sharedStrings.length) {
        value = sharedStrings[idx]
      }
    }
    
    return value
  }
  
  return ''
}

function executeMatch() {
  if (!mainData.value || !refData.value) {
    error.value = '请先选择主表和参照表'
    return
  }
  
  if (!mainMatchColumn.value) {
    error.value = '请选择公共列'
    return
  }
  
  if (selectedReturnColumns.value.length === 0) {
    error.value = '请选择至少一个匹配列'
    return
  }
  
  if (matchMode.value === 'regex' && !regexPattern.value) {
    error.value = '请输入正则表达式'
    return
  }
  
  loading.value = true
  error.value = null
  
  try {
    const result = []
    matchCount.value = 0
    
    const refLookup = {}
    refData.value.forEach(row => {
      const key = String(row[mainMatchColumn.value] || '')
      if (key) {
        refLookup[key] = row
      }
    })
    
    mainData.value.forEach(row => {
      const mainValue = String(row[mainMatchColumn.value] || '')
      let matchedRow = null
      
      switch (matchMode.value) {
        case 'exact':
          matchedRow = refLookup[mainValue]
          break
        case 'fuzzy':
          for (const [refValue, refRow] of Object.entries(refLookup)) {
            if (refValue.includes(mainValue) || mainValue.includes(refValue)) {
              matchedRow = refRow
              break
            }
          }
          break
        case 'regex':
          try {
            const regex = new RegExp(regexPattern.value)
            for (const [refValue, refRow] of Object.entries(refLookup)) {
              if (regex.test(refValue)) {
                matchedRow = refRow
                break
              }
            }
          } catch (e) {
            error.value = '无效的正则表达式: ' + e.message
            loading.value = false
            return
          }
          break
      }
      
      const newRow = { ...row }
      selectedReturnColumns.value.forEach(col => {
        const newColName = Object.keys(mainData.value[0]).includes(col) ? `${col}_参照` : col
        newRow[newColName] = matchedRow ? matchedRow[col] : ''
      })
      
      if (matchedRow) matchCount.value++
      result.push(newRow)
    })
    
    resultData.value = result
  } catch (e) {
    error.value = '匹配过程出错: ' + e.message
  } finally {
    loading.value = false
  }
}

function isRowMatched(row) {
  return selectedReturnColumns.value.some(col => {
    const newColName = Object.keys(mainData.value[0]).includes(col) ? `${col}_参照` : col
    return row[newColName] !== ''
  })
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function downloadResult() {
  if (!resultData.value || resultData.value.length === 0) return
  
  const headers = resultColumns.value
  const rows = [headers.join(',')]
  
  resultData.value.forEach(row => {
    const rowValues = headers.map(col => {
      const value = String(row[col] || '')
      if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value
    })
    rows.push(rowValues.join(','))
  })
  
  const csvContent = '\uFEFF' + rows.join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${mainSheetName.value}_匹配结果.csv`
  link.style.display = 'none'
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

.bg-red-50 {
  background-color: #fef2f2;
}

.border-red-200 {
  border-color: #fecaca;
}

.text-red-500 {
  color: #ef4444;
}

.text-red-600 {
  color: #dc2626;
}

.text-red-700 {
  color: #b91c1c;
}

.text-green-600 {
  color: #16a34a;
}

.text-green-700 {
  color: #15803d;
}

.bg-green-50 {
  background-color: #f0fdf4;
}

.border-green-200 {
  border-color: #bbf7d0;
}

.bg-green-100 {
  background-color: #dcfce7;
}

.border-green-200 {
  border-color: #bbf7d0;
}
</style>