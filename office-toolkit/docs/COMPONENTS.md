# 组件文档

## 概述

办公工具箱提供了一套全局通用组件，所有工具都可以复用这些组件。

## 组件列表

| 组件 | 用途 | 文件路径 |
|------|------|----------|
| Uploader | 文件上传 | src/components/Uploader.vue |
| Preview | 文件预览 | src/components/Preview.vue |
| DownloadButton | 下载按钮 | src/components/DownloadButton.vue |
| Loading | 加载提示 | src/components/Loading.vue |
| ErrorMessage | 错误提示 | src/components/ErrorMessage.vue |
| Navbar | 导航栏 | src/components/Navbar.vue |
| Footer | 页脚 | src/components/Footer.vue |

---

## Uploader - 文件上传组件

### 功能特性

- 支持点击上传和拖拽上传
- 支持单文件和多文件上传
- 支持文件类型过滤
- 显示文件信息（名称、大小）
- 支持删除已选文件

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | String | '点击或拖拽上传文件' | 上传区域标题 |
| hint | String | '支持多种文件格式...' | 上传区域提示文字 |
| accept | String | '*' | 接受的文件类型，如 '.xlsx,.xls' 或 'image/*' |
| multiple | Boolean | false | 是否支持多文件上传 |

### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| files-selected | File[] | 文件选择后触发，返回文件数组 |

### Methods

| 方法 | 说明 |
|------|------|
| clearFiles() | 清空已选文件 |

### 使用示例

```vue
<template>
  <Uploader
    ref="uploader"
    title="上传 Excel 文件"
    hint="支持 .xlsx、.xls 格式"
    accept=".xlsx,.xls"
    :multiple="false"
    @files-selected="handleFilesSelected"
  />
</template>

<script setup>
import { ref } from 'vue'
import Uploader from '@/components/Uploader.vue'

const uploader = ref(null)
const files = ref([])

function handleFilesSelected(selectedFiles) {
  files.value = selectedFiles
  console.log('已选择文件:', selectedFiles)
}

// 清空文件
function clear() {
  uploader.value?.clearFiles()
}
</script>
```

### 样式定制

组件使用 TailwindCSS，可通过 CSS 变量或深度选择器定制：

```css
:deep(.uploader-container) {
  border-color: #your-color;
}
```

---

## Preview - 文件预览组件

### 功能特性

- 支持图片预览（JPG、PNG、WebP等）
- 支持文本预览
- 支持 PDF 预览（浏览器支持时）
- 显示文件基本信息

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| file | File | null | 要预览的文件对象 |

### 使用示例

```vue
<template>
  <Preview :file="selectedFile" />
</template>

<script setup>
import { ref } from 'vue'
import Preview from '@/components/Preview.vue'

const selectedFile = ref(null)
</script>
```

### 支持的文件类型

| 类型 | 预览方式 |
|------|----------|
| image/* | 图片直接显示 |
| text/* | 文本内容显示 |
| application/json | JSON 格式化显示 |
| application/pdf | PDF 嵌入显示 |
| 其他 | 显示文件信息卡片 |

---

## DownloadButton - 下载按钮组件

### 功能特性

- 统一的下载按钮样式
- 支持加载状态
- 支持禁用状态
- 多种颜色变体

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| label | String | '下载' | 按钮文字 |
| variant | String | 'primary' | 颜色变体：primary/secondary/success/danger |
| disabled | Boolean | false | 是否禁用 |
| loading | Boolean | false | 是否显示加载状态 |

### Events

| 事件 | 说明 |
|------|------|
| click | 点击按钮时触发 |

### 使用示例

```vue
<template>
  <!-- 基础用法 -->
  <DownloadButton @click="handleDownload" />
  
  <!-- 自定义文字 -->
  <DownloadButton label="下载 CSV 文件" @click="handleDownload" />
  
  <!-- 成功样式 -->
  <DownloadButton variant="success" label="下载结果" @click="handleDownload" />
  
  <!-- 加载状态 -->
  <DownloadButton :loading="isProcessing" label="下载中..." />
</template>

<script setup>
import { ref } from 'vue'
import DownloadButton from '@/components/DownloadButton.vue'

const isProcessing = ref(false)

async function handleDownload() {
  isProcessing.value = true
  try {
    // 下载逻辑...
  } finally {
    isProcessing.value = false
  }
}
</script>
```

---

## Loading - 加载提示组件

### 功能特性

- 旋转加载动画
- 可自定义大小
- 可自定义提示文字
- 支持全屏模式

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| text | String | '加载中...' | 提示文字 |
| size | String | 'md' | 尺寸：sm/md/lg |
| fullscreen | Boolean | false | 是否全屏显示 |

### 使用示例

```vue
<template>
  <!-- 内联加载 -->
  <Loading v-if="loading" text="处理中..." />
  
  <!-- 全屏加载 -->
  <Loading v-if="loading" fullscreen text="正在处理..." />
  
  <!-- 小尺寸 -->
  <Loading size="sm" />
</template>

<script setup>
import { ref } from 'vue'
import Loading from '@/components/Loading.vue'

const loading = ref(false)
</script>
```

---

## ErrorMessage - 错误提示组件

### 功能特性

- 多种提示类型（错误、警告、成功、信息）
- 可关闭
- 图标自动匹配

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| message | String | - | 提示消息（必填） |
| variant | String | 'error' | 类型：error/warning/success/info |
| dismissible | Boolean | false | 是否可关闭 |

### Events

| 事件 | 说明 |
|------|------|
| dismiss | 点击关闭按钮时触发 |

### 使用示例

```vue
<template>
  <!-- 错误提示 -->
  <ErrorMessage
    v-if="error"
    :message="error"
    variant="error"
    dismissible
    @dismiss="error = null"
  />
  
  <!-- 成功提示 -->
  <ErrorMessage
    v-if="success"
    :message="success"
    variant="success"
  />
  
  <!-- 警告提示 -->
  <ErrorMessage
    message="文件大小超过限制"
    variant="warning"
  />
</template>

<script setup>
import { ref } from 'vue'
import ErrorMessage from '@/components/ErrorMessage.vue'

const error = ref(null)
const success = ref(null)
</script>
```

### 变体样式

| 变体 | 颜色 | 图标 |
|------|------|------|
| error | 红色 | 感叹号圆圈 |
| warning | 黄色 | 警告三角 |
| success | 绿色 | 对勾圆圈 |
| info | 蓝色 | 信息圆圈 |

---

## Navbar - 导航栏组件

### 功能特性

- 显示所有分类导航
- 响应式设计（移动端折叠菜单）
- 当前分类高亮
- 点击切换分类

### 使用方式

导航栏在 `App.vue` 中全局引入，无需单独使用。

```vue
<!-- App.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <main>
      <router-view />
    </main>
    <Footer />
  </div>
</template>
```

---

## Footer - 页脚组件

### 功能特性

- 显示版权信息
- 显示隐私提示
- 响应式布局

### 使用方式

页脚在 `App.vue` 中全局引入，无需单独使用。

---

## 组合使用示例

```vue
<template>
  <div class="tool-page">
    <!-- 错误提示 -->
    <ErrorMessage
      v-if="error"
      :message="error"
      variant="error"
      dismissible
      @dismiss="error = null"
    />
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 上传区域 -->
      <div class="card p-6">
        <h2 class="font-semibold text-gray-900 mb-4">上传文件</h2>
        <Uploader
          ref="uploader"
          accept="image/*"
          @files-selected="handleFilesSelected"
        />
        <button
          v-if="files.length > 0"
          @click="process"
          class="btn-primary w-full mt-4"
          :disabled="loading"
        >
          处理
        </button>
      </div>
      
      <!-- 预览区域 -->
      <div class="card p-6">
        <h2 class="font-semibold text-gray-900 mb-4">预览</h2>
        
        <!-- 加载状态 -->
        <Loading v-if="loading" text="处理中..." />
        
        <!-- 预览 -->
        <Preview v-else-if="resultFile" :file="resultFile" />
        
        <!-- 空状态 -->
        <div v-else class="text-center py-12 text-gray-400">
          <p>结果将在这里显示</p>
        </div>
        
        <!-- 下载按钮 -->
        <DownloadButton
          v-if="resultFile"
          label="下载结果"
          variant="success"
          @click="download"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Uploader from '@/components/Uploader.vue'
import Preview from '@/components/Preview.vue'
import DownloadButton from '@/components/DownloadButton.vue'
import Loading from '@/components/Loading.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'

const meta = {
  title: '示例工具',
  description: '组件组合使用示例',
  icon: '📦'
}

const uploader = ref(null)
const files = ref([])
const resultFile = ref(null)
const loading = ref(false)
const error = ref(null)

function handleFilesSelected(selectedFiles) {
  files.value = selectedFiles
  error.value = null
}

async function process() {
  if (files.value.length === 0) return
  
  loading.value = true
  error.value = null
  
  try {
    // 处理逻辑...
    resultFile.value = files.value[0]
  } catch (e) {
    error.value = `处理失败: ${e.message}`
  } finally {
    loading.value = false
  }
}

function download() {
  // 下载逻辑...
}
</script>
```
