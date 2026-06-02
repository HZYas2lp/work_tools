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
    
    <div class="card p-6 max-w-2xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">数值</label>
          <input
            v-model.number="inputValue"
            type="number"
            class="input-field"
            placeholder="输入数值"
          />
        </div>
        
        <div class="flex flex-col items-center">
          <select
            v-model="fromUnit"
            class="input-field"
          >
            <option v-for="unit in units" :key="unit.id" :value="unit.id">
              {{ unit.name }}
            </option>
          </select>
        </div>
        
        <div class="flex flex-col items-center">
          <button @click="swapUnits" class="p-2 rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </button>
        </div>
        
        <div></div>
        
        <div class="flex flex-col items-center">
          <select
            v-model="toUnit"
            class="input-field"
          >
            <option v-for="unit in units" :key="unit.id" :value="unit.id">
              {{ unit.name }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">结果</label>
          <div class="input-field bg-gray-50 cursor-not-allowed">
            {{ outputValue.toFixed(4) }}
          </div>
        </div>
      </div>
      
      <div class="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 class="font-medium text-gray-700 mb-2">转换公式</h3>
        <p class="text-sm text-gray-600">{{ conversionFormula }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const meta = {
  title: '单位换算',
  description: '常用单位之间的换算，支持长度、重量、温度等',
  icon: '🔄'
}

const units = [
  { id: 'm', name: '米', base: 1 },
  { id: 'km', name: '千米', base: 1000 },
  { id: 'cm', name: '厘米', base: 0.01 },
  { id: 'mm', name: '毫米', base: 0.001 },
  { id: 'inch', name: '英寸', base: 0.0254 },
  { id: 'ft', name: '英尺', base: 0.3048 },
  { id: 'yd', name: '码', base: 0.9144 },
  { id: 'mile', name: '英里', base: 1609.34 }
]

const inputValue = ref(1)
const fromUnit = ref('m')
const toUnit = ref('km')

const outputValue = computed(() => {
  const from = units.find(u => u.id === fromUnit.value)
  const to = units.find(u => u.id === toUnit.value)
  
  if (!from || !to) return 0
  
  return (inputValue.value * from.base) / to.base
})

const conversionFormula = computed(() => {
  const from = units.find(u => u.id === fromUnit.value)
  const to = units.find(u => u.id === toUnit.value)
  
  if (!from || !to) return ''
  
  return `${inputValue.value} ${from.name} = ${inputValue.value} × ${from.base} ÷ ${to.base} = ${outputValue.value.toFixed(4)} ${to.name}`
})

function swapUnits() {
  const temp = fromUnit.value
  fromUnit.value = toUnit.value
  toUnit.value = temp
}
</script>

<style scoped>
.tool-page {
  min-height: 60vh;
}
</style>
