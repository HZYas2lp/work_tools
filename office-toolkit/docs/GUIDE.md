# 开发指南

## 环境准备

### 方式一：Node.js 环境（推荐）

1. 安装 Node.js 18+
2. 安装 pnpm（可选）
   ```bash
   npm install -g pnpm
   ```

### 方式二：独立开发

无需 Node.js，直接编辑 `standalone.html` 文件。

## 创建新工具

### 步骤一：选择分类

根据工具功能选择合适的分类目录：

| 分类 | 适用场景 |
|------|----------|
| excel | Excel/CSV 文件处理 |
| pdf | PDF 文件处理 |
| image | 图片处理、格式转换 |
| text | 文本处理、编码转换 |
| convert | 各类格式转换 |
| ai-office | AI辅助办公工具 |

### 步骤二：创建工具文件

在对应分类目录下创建 `.vue` 文件，命名规则：`kebab-case.vue`

```
tools/
├── excel/
│   ├── excel-to-csv.vue      # Excel转CSV
│   └── csv-to-excel.vue      # CSV转Excel
├── image/
│   ├── image-resizer.vue     # 图片尺寸调整
│   ├── image-compressor.vue  # 图片压缩
│   └── image-converter.vue   # 图片格式转换
```

### 步骤三：编写工具代码

#### 基础模板

```vue
<template>
  <div class="tool-page">
    <!-- 工具标题区域 -->
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
    
    <!-- 工具主体内容 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 左侧：上传/输入区域 -->
      <div class="card p-6">
        <h2 class="font-semibold text-gray-900 mb-4">上传文件</h2>
        <Uploader
          ref="uploader"
          :accept="acceptedFormats"
          @files-selected="handleFilesSelected"
        />
        <button @click="process" class="btn-primary w-full mt-4">
          处理
        </button>
      </div>
      
      <!-- 右侧：结果/预览区域 -->
      <div class="card p-6">
        <h2 class="font-semibold text-gray-900 mb-4">结果</h2>
        <Preview :file="resultFile" />
        <DownloadButton
          v-if="hasResult"
          label="下载结果"
          @click="downloadResult"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Uploader from '../../src/components/Uploader.vue'
import Preview from '../../src/components/Preview.vue'
import DownloadButton from '../../src/components/DownloadButton.vue'

// 工具元数据（必须导出）
const meta = {
  title: '工具名称',
  description: '工具描述',
  icon: '📦'
}

// 状态
const uploader = ref(null)
const files = ref([])
const resultFile = ref(null)
const hasResult = ref(false)

// 支持的文件格式
const acceptedFormats = '.xlsx,.xls'

// 处理文件选择
function handleFilesSelected(selectedFiles) {
  files.value = selectedFiles
}

// 处理逻辑
async function process() {
  if (files.value.length === 0) return
  
  const file = files.value[0]
  // 实现处理逻辑...
  
  hasResult.value = true
}

// 下载结果
function downloadResult() {
  // 实现下载逻辑...
}
</script>

<style scoped>
.tool-page {
  min-height: 60vh;
}
</style>
```

### 步骤四：测试工具

```bash
# 启动开发服务器
npm run dev

# 访问 http://localhost:5173
# 导航到对应分类，点击工具卡片
```

## 工具开发规范

### 1. 元数据规范

```javascript
const meta = {
  title: String,      // 必填，工具标题，建议2-8个字
  description: String, // 必填，工具描述，建议10-30个字
  icon: String        // 必填，emoji图标
}
```

### 2. 文件处理规范

```javascript
// 读取文件
async function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = reject
    
    // 根据文件类型选择读取方式
    if (file.type.startsWith('text/')) {
      reader.readAsText(file)
    } else {
      reader.readAsArrayBuffer(file)
    }
  })
}

// 生成下载
function downloadFile(content, filename, mimeType) {
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
```

### 3. 错误处理规范

```vue
<template>
  <div>
    <ErrorMessage
      v-if="error"
      :message="error"
      variant="error"
      dismissible
      @dismiss="error = null"
    />
  </div>
</template>

<script setup>
import ErrorMessage from '../../src/components/ErrorMessage.vue'

const error = ref(null)

async function process() {
  try {
    error.value = null
    // 处理逻辑...
  } catch (e) {
    error.value = `处理失败: ${e.message}`
  }
}
</script>
```

### 4. 加载状态规范

```vue
<template>
  <button :disabled="loading" @click="process">
    <Loading v-if="loading" size="sm" />
    <span v-else>处理</span>
  </button>
</template>

<script setup>
import Loading from '../../src/components/Loading.vue'

const loading = ref(false)

async function process() {
  loading.value = true
  try {
    // 处理逻辑...
  } finally {
    loading.value = false
  }
}
</script>
```

## 常见工具类型实现

### 文件转换类工具

```vue
<script setup>
async function convert() {
  const file = files.value[0]
  
  // 1. 读取文件
  const content = await readFile(file)
  
  // 2. 转换处理
  const result = transform(content)
  
  // 3. 生成结果
  resultFile.value = new File([result], 'converted.txt', {
    type: 'text/plain'
  })
}
</script>
```

### 图片处理类工具

```vue
<script setup>
async function processImage() {
  const file = files.value[0]
  
  // 1. 创建图片对象
  const img = new Image()
  img.src = URL.createObjectURL(file)
  
  await new Promise(resolve => {
    img.onload = resolve
  })
  
  // 2. Canvas处理
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = img.width
  canvas.height = img.height
  ctx.drawImage(img, 0, 0)
  
  // 3. 导出结果
  canvas.toBlob(blob => {
    resultFile.value = new File([blob], 'result.jpg', {
      type: 'image/jpeg'
    })
  }, 'image/jpeg', 0.9)
}
</script>
```

### 文本处理类工具

```vue
<script setup>
function processText() {
  const text = inputText.value
  
  // 处理逻辑
  const result = text
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .join('\n')
  
  outputText.value = result
}
</script>
```

## 样式指南

### 布局

```vue
<!-- 两栏布局 -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <div>左侧</div>
  <div>右侧</div>
</div>

<!-- 三栏布局 -->
<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div class="lg:col-span-2">主内容</div>
  <div>侧边栏</div>
</div>
```

### 按钮

```vue
<!-- 主按钮 -->
<button class="btn-primary">主要操作</button>

<!-- 次要按钮 -->
<button class="btn-secondary">次要操作</button>

<!-- 成功按钮 -->
<button class="btn-success">下载</button>

<!-- 危险按钮 -->
<button class="btn-danger">删除</button>
```

### 卡片

```vue
<div class="card p-6">
  <h2 class="font-semibold text-gray-900 mb-4">标题</h2>
  <!-- 内容 -->
</div>
```

### 输入框

```vue
<input type="text" class="input-field" placeholder="请输入...">

<textarea class="input-field h-32 resize-none"></textarea>
```

## 调试技巧

### 1. 控制台日志

```javascript
console.log('文件信息:', file.name, file.type, file.size)
console.log('处理结果:', result)
```

### 2. Vue DevTools

安装 Vue DevTools 浏览器扩展，查看组件状态。

### 3. 网络请求

虽然工具不发送网络请求，但可以在 DevTools 的 Network 面板查看 CDN 资源加载情况。

## 发布检查清单

- [ ] 工具元数据完整（title, description, icon）
- [ ] 文件上传功能正常
- [ ] 处理逻辑正确
- [ ] 下载功能正常
- [ ] 错误处理完善
- [ ] 加载状态显示
- [ ] 响应式布局适配
- [ ] 无控制台错误
