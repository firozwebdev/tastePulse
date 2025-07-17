<script setup>
import { ref } from 'vue'

defineProps({
  msg: String,
})

const count = ref(0)
const isAnimating = ref(false)

const incrementCount = () => {
  count.value++
  isAnimating.value = true
  setTimeout(() => {
    isAnimating.value = false
  }, 200)
}
</script>

<template>
  <div class="card p-8 max-w-md mx-auto animate-slide-up">
    <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">{{ msg }}</h2>
    
    <div class="text-center mb-6">
      <div class="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
        <span 
          class="text-3xl font-bold text-white transition-transform duration-200"
          :class="{ 'scale-110': isAnimating }"
        >
          {{ count }}
        </span>
      </div>
      <p class="text-gray-600 mb-4">
        Click the button below to increment the counter
      </p>
      <button 
        type="button" 
        @click="incrementCount"
        class="btn-primary w-full"
      >
        Count is {{ count }}
      </button>
    </div>

    <div class="space-y-4 text-sm text-gray-600">
      <p class="flex items-center justify-center space-x-2">
        <span>✨</span>
        <span>Edit <code class="bg-gray-100 px-2 py-1 rounded text-xs">components/HelloWorld.vue</code> to test HMR</span>
      </p>
      
      <div class="flex flex-wrap gap-2 justify-center">
        <a 
          href="https://vuejs.org/guide/quick-start.html#local" 
          target="_blank"
          class="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium hover:bg-green-200 transition-colors"
        >
          📚 Vue Guide
        </a>
        <a 
          href="https://vitejs.dev/guide/" 
          target="_blank"
          class="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors"
        >
          ⚡ Vite Docs
        </a>
        <a 
          href="https://tailwindcss.com/docs" 
          target="_blank"
          class="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium hover:bg-purple-200 transition-colors"
        >
          🎨 Tailwind CSS
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
code {
  font-family: 'Fira Code', 'Consolas', monospace;
}
</style>