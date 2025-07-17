<template>
  <div class="relative language-selector">
    <button 
      @click="isOpen = !isOpen"
      class="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 active:scale-95"
      :class="{ 'ring-2 ring-primary-500': isOpen }"
    >
      <div class="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
        <img :src="currentLanguage.flag" :alt="currentLanguage.name" class="w-full h-full object-cover" />
      </div>
      <span>{{ currentLanguage.name }}</span>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        class="h-4 w-4 transition-transform duration-300" 
        :class="{ 'rotate-180': isOpen }"
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div 
        v-if="isOpen"
        class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 overflow-hidden"
      >
        <div class="py-1">
          <button
            v-for="language in languages"
            :key="language.code"
            @click="selectLanguage(language.code)"
            class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors duration-200"
            :class="{ 'bg-primary-50 dark:bg-primary-900/20': language.code === selectedLanguage }"
          >
            <div class="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
              <img :src="language.flag" :alt="language.name" class="w-full h-full object-cover" />
            </div>
            <span class="flex-grow">{{ language.name }}</span>
            <span v-if="language.code === selectedLanguage" class="text-primary-600 dark:text-primary-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </transition>
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

// Available languages with flag images
const languages = [
  { 
    code: 'en', 
    name: 'English',
    flag: 'https://flagcdn.com/w40/us.png'
  },
  { 
    code: 'bn', 
    name: 'বাংলা',
    flag: 'https://flagcdn.com/w40/bd.png'
  },
  { 
    code: 'es', 
    name: 'Español',
    flag: 'https://flagcdn.com/w40/es.png'
  }
];

// Get current language object
const currentLanguage = computed(() => {
  return languages.find(lang => lang.code === props.selectedLanguage) || languages[0];
});

// Select a language
function selectLanguage(code) {
  emit('change', code);
  isOpen.value = false;
  
  // Save selected language to localStorage
  localStorage.setItem('preferredLanguage', code);
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
  
  // Load preferred language from localStorage if available
  const savedLanguage = localStorage.getItem('preferredLanguage');
  if (savedLanguage && savedLanguage !== props.selectedLanguage) {
    emit('change', savedLanguage);
  }
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