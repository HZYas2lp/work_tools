# API 文档

## 路由 API

### 路由结构

```
/                        # 首页
/:category               # 分类页
/:category/:tool         # 工具页
```

### 路由方法

#### createAppRouter()

创建应用路由实例。

```javascript
import { createAppRouter } from '@/router'

const router = createAppRouter()
app.use(router)
```

#### getAllTools()

获取所有工具列表。

```javascript
import { getAllTools } from '@/router'

const tools = getAllTools()
// 返回: Array<{ category, name, path, component, meta }>
```

#### getCategories()

获取所有分类列表。

```javascript
import { getCategories } from '@/router'

const categories = getCategories()
// 返回: Array<{ id, name, icon }>
```

#### getToolsByCategory(categoryId)

获取指定分类下的所有工具。

```javascript
import { getToolsByCategory } from '@/router'

const excelTools = getToolsByCategory('excel')
// 返回: Array<{ category, name, path, component, meta }>
```

#### getCategoryName(categoryId)

获取分类的中文名称。

```javascript
import { getCategoryName } from '@/router'

const name = getCategoryName('excel')
// 返回: 'Excel工具'
```

#### getCategoryIcon(categoryId)

获取分类的图标。

```javascript
import { getCategoryIcon } from '@/router'

const icon = getCategoryIcon('excel')
// 返回: '📊'
```

---

## 工具元数据 API

### meta 对象

每个工具组件必须导出 `meta` 对象。

```javascript
const meta = {
  title: String,      // 工具标题
  description: String, // 工具描述
  icon: String        // 工具图标（emoji）
}
```

### 示例

```javascript
const meta = {
  title: 'Excel 转 CSV',
  description: '将 Excel 文件转换为 CSV 格式',
  icon: '📊'
}
```

---

## 组件 Props API

### Uploader Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | String | '点击或拖拽上传文件' | 上传区域标题 |
| hint | String | '支持多种文件格式，所有数据本地处理' | 提示文字 |
| accept | String | '*' | 接受的文件类型 |
| multiple | Boolean | false | 是否多选 |

### Preview Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| file | File | null | 预览的文件对象 |

### DownloadButton Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| label | String | '下载' | 按钮文字 |
| variant | String | 'primary' | 颜色变体 |
| disabled | Boolean | false | 是否禁用 |
| loading | Boolean | false | 加载状态 |

### Loading Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| text | String | '加载中...' | 提示文字 |
| size | String | 'md' | 尺寸（sm/md/lg） |
| fullscreen | Boolean | false | 全屏模式 |

### ErrorMessage Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| message | String | - | 提示消息 |
| variant | String | 'error' | 类型（error/warning/success/info） |
| dismissible | Boolean | false | 可关闭 |

---

## 组件 Events API

### Uploader Events

| 事件 | 参数 | 说明 |
|------|------|------|
| files-selected | File[] | 文件选择后触发 |

### DownloadButton Events

| 事件 | 说明 |
|------|------|
| click | 点击按钮时触发 |

### ErrorMessage Events

| 事件 | 说明 |
|------|------|
| dismiss | 关闭时触发 |

---

## 组件 Methods API

### Uploader Methods

```javascript
// 清空已选文件
uploader.value.clearFiles()

// 获取已选文件
const files = uploader.value.files
```

---

## 文件处理 API

### 读取文本文件

```javascript
function readTextFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsText(file)
  })
}

// 使用
const text = await readTextFile(file)
```

### 读取二进制文件

```javascript
function readArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

// 使用
const buffer = await readArrayBuffer(file)
```

### 读取为 Data URL

```javascript
function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// 使用
const dataUrl = await readAsDataURL(file)
```

### 下载文件

```javascript
function downloadFile(content, filename, mimeType = 'application/octet-stream') {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// 下载文本
downloadFile('Hello World', 'hello.txt', 'text/plain')

// 下载 JSON
downloadFile(JSON.stringify(data), 'data.json', 'application/json')

// 下载 CSV
downloadFile(csvContent, 'data.csv', 'text/csv')
```

### 下载 Blob

```javascript
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
```

---

## 图片处理 API

### 加载图片

```javascript
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

// 从文件加载
const img = await loadImage(URL.createObjectURL(file))
```

### Canvas 处理图片

```javascript
function processImage(img, width, height) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(img, 0, 0, width, height)
  
  return canvas
}
```

### Canvas 转 Blob

```javascript
function canvasToBlob(canvas, type = 'image/jpeg', quality = 0.9) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, type, quality)
  })
}

// 使用
const blob = await canvasToBlob(canvas, 'image/png')
```

### Canvas 转 Data URL

```javascript
const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
```

---

## 工具函数 API

### 格式化文件大小

```javascript
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB'
}

formatFileSize(1024)      // '1.0 KB'
formatFileSize(1536)      // '1.5 KB'
formatFileSize(1048576)   // '1.0 MB'
```

### 获取文件图标

```javascript
function getFileIcon(mimeType) {
  if (mimeType?.includes('image')) return '🖼️'
  if (mimeType?.includes('pdf')) return '📄'
  if (mimeType?.includes('excel') || mimeType?.includes('spreadsheet')) return '📊'
  if (mimeType?.includes('word') || mimeType?.includes('document')) return '📝'
  if (mimeType?.includes('video')) return '🎬'
  if (mimeType?.includes('audio')) return '🎵'
  if (mimeType?.includes('zip') || mimeType?.includes('rar')) return '📦'
  return '📎'
}
```

### 转义 CSV 字段

```javascript
function escapeCsvField(value) {
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"'
  }
  return str
}
```

### 复制到剪贴板

```javascript
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (e) {
    console.error('复制失败:', e)
    return false
  }
}
```

---

## 路由元信息 API

### 访问路由元信息

```javascript
import { useRoute } from 'vue-router'

const route = useRoute()

// 获取当前工具信息
const toolMeta = route.meta
// {
//   category: 'excel',
//   title: 'Excel 转 CSV',
//   description: '将 Excel 文件转换为 CSV 格式',
//   icon: '📊'
// }
```

### 获取当前分类

```javascript
const route = useRoute()
const currentCategory = route.params.category  // 'excel'
const currentTool = route.params.tool          // 'excel-to-csv'
```

---

## 类型定义

### Tool

```typescript
interface Tool {
  category: string       // 分类ID
  name: string          // 工具名称（文件名）
  path: string          // 路由路径
  component: Component  // Vue组件
  meta: ToolMeta        // 元数据
}
```

### ToolMeta

```typescript
interface ToolMeta {
  title: string         // 工具标题
  description: string   // 工具描述
  icon: string          // 工具图标
}
```

### Category

```typescript
interface Category {
  id: string            // 分类ID
  name: string          // 分类名称
  icon: string          // 分类图标
}
```

### FileWithMeta

```typescript
interface FileWithMeta {
  file: File
  name: string
  size: number
  type: string
  icon: string
}
```
