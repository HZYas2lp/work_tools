# 办公工具箱 (Office Toolkit)

一个高可迭代的纯前端办公工具箱，支持无限扩展新工具，所有数据本地处理，不上传服务器。

## 🚀 最新功能

### Excel 列匹配工具 (核心功能)
- 实现类似 Excel VLOOKUP 功能，但更加直观和强大
- 支持两种比对模式：
  - **单文件多工作表模式**：使用同一 Excel 文件的不同工作表进行比对
  - **双文件比对模式**：分别上传两个 Excel 文件进行比对
- 三种匹配方式：
  - **精确匹配**：完全相等时匹配
  - **模糊匹配**：包含关系匹配
  - **正则匹配**：支持自定义正则表达式进行匹配

## 项目特性

- **模块化设计** - 工具独立开发，互不冲突
- **自动路由注册** - 新增工具无需手动配置路由
- **动态首页渲染** - 自动读取所有分类和工具
- **全局通用组件** - 上传、预览、下载、加载、报错提示
- **响应式设计** - 适配电脑和手机端
- **纯前端处理** - 数据安全，不上传服务器

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue | 3.4+ | 前端框架 |
| Vue Router | 4.3+ | 路由管理 |
| Vite | 5.2+ | 构建工具 |
| TailwindCSS | 3.4+ | 样式框架 |
| xlsx | 0.18.5+ | Excel 解析 |

## 目录结构

```
office-toolkit/
├── docs/                    # 开发文档
│   ├── README.md           # 项目概述
│   ├── ARCHITECTURE.md     # 架构设计
│   ├── GUIDE.md            # 开发指南
│   ├── COMPONENTS.md       # 组件文档
│   └── API.md              # API文档
├── CHANGELOG.md            # 开发日志
├── src/
│   ├── components/         # 全局通用组件
│   │   ├── Uploader.vue    # 文件上传
│   │   ├── Preview.vue     # 文件预览
│   │   ├── DownloadButton.vue
│   │   ├── Loading.vue
│   │   ├── ErrorMessage.vue
│   │   ├── Navbar.vue
│   │   └── Footer.vue
│   ├── router/
│   │   └── index.js        # 路由配置（自动注册）
│   ├── views/
│   │   ├── Home.vue        # 首页
│   │   └── Category.vue    # 分类页
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── tools/                   # 工具目录
│   ├── excel/              # Excel工具
│   │   ├── excel-to-csv.vue
│   │   └── excel-vlookup.vue    # Excel 列匹配工具
│   ├── pdf/                # PDF工具
│   │   └── pdf-merger.vue
│   ├── image/              # 图片工具
│   │   └── image-resizer.vue
│   ├── text/               # 文本工具
│   │   └── text-counter.vue
│   ├── convert/            # 格式转换
│   │   └── unit-converter.vue
│   └── ai-office/          # AI办公
│       └── text-summarizer.vue
├── standalone.html          # 独立运行版本（无需Node.js）
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 快速开始

### 方式一：Node.js 环境（推荐）

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 生产构建
npm run build
```

### 方式二：独立版本（无需Node.js）

```bash
# 使用Python启动HTTP服务器
python -m http.server 3000 --bind 127.0.0.1

# 访问 http://localhost:3000/standalone.html
```

## 预设分类

| 分类ID | 名称 | 图标 |
|--------|------|------|
| excel | Excel工具 | 📊 |
| pdf | PDF工具 | 📄 |
| image | 图片工具 | 🖼️ |
| text | 文本工具 | 📝 |
| convert | 格式转换 | 🔄 |
| ai-office | AI办公 | 🤖 |

## 工具列表

### Excel 工具
- Excel to CSV - Excel 文件转换为 CSV
- Excel 列匹配 - 实现 VLOOKUP 功能

### PDF 工具
- PDF 合并

### 图片工具
- 图片调整

### 文本工具
- 文本计数器

### 格式转换
- 单位转换器

### AI 办公
- 文本摘要

## 添加新工具

只需在对应分类目录下创建 `.vue` 文件，框架会自动识别并注册路由：

```vue
<template>
  <div class="tool-page">
    <!-- 工具内容 -->
  </div>
</template>

<script setup>
const meta = {
  title: '工具名称',
  description: '工具描述',
  icon: '📦'
}
</script>
```

详细开发指南请参考 [GUIDE.md](./GUIDE.md)

## 文档目录

- [开发日志](./CHANGELOG.md) - 版本历史更新记录
- [架构设计](./ARCHITECTURE.md) - 项目架构和技术实现
- [开发指南](./GUIDE.md) - 如何开发新工具
- [组件文档](./COMPONENTS.md) - 通用组件使用说明
- [API文档](./API.md) - 路由和工具API

## 许可证

MIT License
