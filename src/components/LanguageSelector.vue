<template>
  <div class="relative">
    <button 
      @click="isOpen = !isOpen"
      class="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
    >
      <span>{{ currentLanguage.name }}</span>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        class="h-4 w-4 transition-transform" 
        :class="{ 'rotate-180': isOpen }"
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    
    <div 
      v-if="isOpen"
      class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10"
    >
      <div class="py-1">
        <button
          v-for="language in languages"
          :key="language.code"
          @click="selectLanguage(language.code)"
          class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
          :class="{ 'bg-gray-100 dark:bg-gray-700': language.code === selectedLanguage }"
        >
          <span v-if="language.code === selectedLanguage" class="text-primary-600 dark:text-primary-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <span v-else class="w-4"></span>
          {{ language.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  selectedLanguage: {
    type: String,
    default: 'en'
  }
});

const emit = defineEmits(['change']);

const isOpen = ref(false);

// Available languages
const languages = [
  { code: 'en', name: 'English' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'es', name: 'Español' }
];

// Get current language object
const currentLanguage = computed(() => {
  return languages.find(lang => lang.code === props.selectedLanguage) || languages[0];
});

// Select a language
function selectLanguage(code) {
  emit('change', code);
  isOpen.value = false;
}

// Close dropdown when clicking outside
function handleClickOutside(event) {
  const dropdown = document.querySelector('.language-selector');
  if (dropdown && !dropdown.contains(event.target)) {
    isOpen.value = false;
  }
}

// Add/remove event listeners
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Close dropdown when pressing escape
watch(() => isOpen.value, (newValue) => {
  if (newValue) {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        isOpen.value = false;
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }
});
</script>