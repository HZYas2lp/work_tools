import { createRouter, createWebHistory } from 'vue-router'

const categories = ['excel', 'pdf', 'image', 'text', 'convert', 'ai-office']

function loadTools() {
  const tools = []
  
  categories.forEach(category => {
    try {
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
    } catch (e) {
      console.warn(`Failed to load tools from category ${category}:`, e)
    }
  })
  
  return tools
}

function generateRoutes() {
  const routes = [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/:category',
      name: 'Category',
      component: () => import('../views/Category.vue')
    }
  ]
  
  const tools = loadTools()
  
  tools.forEach(tool => {
    routes.push({
      path: tool.path,
      name: tool.name,
      component: tool.component,
      meta: {
        category: tool.category,
        title: tool.meta.title,
        description: tool.meta.description,
        icon: tool.meta.icon
      }
    })
  })
  
  return routes
}

export function createAppRouter() {
  const router = createRouter({
    history: createWebHistory(),
    routes: generateRoutes()
  })
  
  return router
}

export function getAllTools() {
  return loadTools()
}

export function getCategories() {
  return categories.map(cat => ({
    id: cat,
    name: getCategoryName(cat),
    icon: getCategoryIcon(cat)
  }))
}

function getCategoryName(category) {
  const names = {
    'excel': 'Excel工具',
    'pdf': 'PDF工具',
    'image': '图片工具',
    'text': '文本工具',
    'convert': '格式转换',
    'ai-office': 'AI办公'
  }
  return names[category] || category
}

function getCategoryIcon(category) {
  const icons = {
    'excel': '📊',
    'pdf': '📄',
    'image': '🖼️',
    'text': '📝',
    'convert': '🔄',
    'ai-office': '🤖'
  }
  return icons[category] || '📦'
}

export function getToolsByCategory(category) {
  const allTools = loadTools()
  return allTools.filter(tool => tool.category === category)
}

export { getCategoryName, getCategoryIcon }
