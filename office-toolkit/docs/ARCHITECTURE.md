# 架构设计文档

## 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                        用户界面层                            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │  首页   │ │ 分类页  │ │ 工具页  │ │ 导航栏  │           │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        组件层                                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ Uploader │ │ Preview  │ │DownloadBtn│ │ Loading │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│  ┌──────────┐ ┌──────────┐                                  │
│  │ErrorMsg  │ │  Navbar  │                                  │
│  └──────────┘ └──────────┘                                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        路由层                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              自动路由注册系统                         │   │
│  │  - 扫描 tools/ 目录                                   │   │
│  │  - 动态生成路由配置                                   │   │
│  │  - 提供工具元数据查询                                 │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        工具层                                │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │ excel/  │ │  pdf/   │ │ image/  │ │  text/  │           │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
│  ┌─────────┐ ┌─────────┐                                    │
│  │convert/ │ │ai-office│                                    │
│  └─────────┘ └─────────┘                                    │
└─────────────────────────────────────────────────────────────┘
```

## 核心模块设计

### 1. 自动路由注册系统

路由系统位于 `src/router/index.js`，核心功能：

```javascript
// 工具目录扫描
const categories = ['excel', 'pdf', 'image', 'text', 'convert', 'ai-office']

function loadTools() {
  const tools = []
  
  categories.forEach(category => {
    // 使用 Vite 的 import.meta.glob 动态导入
    const toolModules = import.meta.glob(`../../tools/${category}/*.vue`, { eager: true })
    
    Object.entries(toolModules).forEach(([path, module]) => {
      const toolName = path.match(/\/([^/]+)\.vue$/)[1]
      const toolComponent = module.default
      
      if (toolComponent && toolComponent.meta) {
        tools.push({
          category,
          name: toolName,
          path: `/${category}/${toolName}`,
          component: toolComponent,
          meta: toolComponent.meta
        })
      }
    })
  })
  
  return tools
}
```

**设计优势：**
- 新增工具只需创建文件，无需修改路由配置
- 工具元数据（标题、描述、图标）在工具组件内定义
- 支持工具的热更新（开发模式）

### 2. 工具元数据规范

每个工具组件必须导出 `meta` 对象：

```javascript
const meta = {
  title: '工具名称',      // 必填：显示在卡片上的标题
  description: '工具描述', // 必填：显示在卡片上的描述
  icon: '📦'             // 必填：工具图标（emoji）
}
```

### 3. 分类系统

预设6大分类，存储在路由模块中：

| 分类ID | 目录名 | 中文名称 | 图标 |
|--------|--------|----------|------|
| excel | tools/excel/ | Excel工具 | 📊 |
| pdf | tools/pdf/ | PDF工具 | 📄 |
| image | tools/image/ | 图片工具 | 🖼️ |
| text | tools/text/ | 文本工具 | 📝 |
| convert | tools/convert/ | 格式转换 | 🔄 |
| ai-office | tools/ai-office/ | AI办公 | 🤖 |

### 4. 组件通信

```
┌──────────────┐     files-selected      ┌──────────────┐
│   Uploader   │ ──────────────────────▶ │   工具页面   │
└──────────────┘                         └──────────────┘
                                                │
                                                ▼
┌──────────────┐     file prop             ┌──────────────┐
│   Preview    │ ◀───────────────────────  │   工具页面   │
└──────────────┘                         └──────────────┘
                                                │
                                                ▼
┌──────────────┐     click event            ┌──────────────┐
│DownloadButton│ ◀───────────────────────  │   工具页面   │
└──────────────┘                         └──────────────┘
```

## 数据流设计

### 文件处理流程

```
用户上传文件
    │
    ▼
Uploader组件
    │
    │ files-selected 事件
    ▼
工具页面接收File对象
    │
    ▼
FileReader / Canvas API 处理
    │
    ▼
生成处理结果
    │
    ▼
Blob + URL.createObjectURL
    │
    ▼
下载按钮触发下载
```

### 路由导航流程

```
用户点击分类
    │
    ▼
navigateToCategory(catId)
    │
    ▼
router.push(`/${catId}`)
    │
    ▼
Category.vue 渲染
    │
    │ getToolsByCategory(catId)
    ▼
显示该分类下所有工具
    │
    │ 用户点击工具
    ▼
navigateToTool(toolPath)
    │
    ▼
router.push(`/${category}/${toolName}`)
    │
    ▼
工具组件渲染
```

## 样式系统

### TailwindCSS 配置

```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./tools/**/*.vue"  // 包含工具目录
  ],
  theme: {
    extend: {
      colors: {
        primary: { /* 蓝色系 */ },
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#0ea5e9'
      }
    }
  }
}
```

### 自定义组件类

```css
/* src/style.css */
@layer components {
  .btn { /* 按钮基础样式 */ }
  .btn-primary { /* 主按钮 */ }
  .btn-secondary { /* 次按钮 */ }
  .card { /* 卡片样式 */ }
  .input-field { /* 输入框样式 */ }
  .loading-spinner { /* 加载动画 */ }
}
```

## 性能优化

### 1. 路由懒加载

```javascript
// 首页和分类页懒加载
{
  path: '/',
  component: () => import('../views/Home.vue')
}
```

### 2. 工具组件按需加载

```javascript
// 工具组件使用 eager: false 可实现按需加载
const toolModules = import.meta.glob(`../../tools/${category}/*.vue`)
```

### 3. 静态资源优化

- 使用 TailwindCSS CDN（独立版本）
- 图片使用内联 Data URL
- 字体使用 Google Fonts CDN

## 安全设计

### 本地处理原则

```
┌─────────────────────────────────────────┐
│              浏览器环境                  │
│  ┌─────────────────────────────────┐   │
│  │          用户文件                │   │
│  └─────────────────────────────────┘   │
│                  │                      │
│                  ▼                      │
│  ┌─────────────────────────────────┐   │
│  │     FileReader / Canvas API      │   │
│  │         本地处理                  │   │
│  └─────────────────────────────────┘   │
│                  │                      │
│                  ▼                      │
│  ┌─────────────────────────────────┐   │
│  │        处理结果                   │   │
│  │    Blob + URL.createObjectURL    │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ❌ 不发送任何数据到服务器              │
└─────────────────────────────────────────┘
```

### 文件类型验证

```javascript
// Uploader.vue
accept: {
  type: String,
  default: '*'
}

// 使用示例
<Uploader accept=".xlsx,.xls" />  // Excel
<Uploader accept="image/*" />      // 图片
<Uploader accept=".pdf" />         // PDF
```

## 扩展性设计

### 添加新分类

1. 在 `tools/` 目录下创建新文件夹
2. 在 `src/router/index.js` 的 `categories` 数组中添加分类ID
3. 添加分类名称和图标映射

### 添加新工具

1. 在对应分类目录下创建 `.vue` 文件
2. 定义 `meta` 元数据
3. 实现工具逻辑

### 添加新组件

1. 在 `src/components/` 目录下创建组件
2. 在工具页面中导入使用
