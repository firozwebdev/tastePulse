<template>
  <div class="bg-white dark:bg-dark-card rounded-xl shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border p-6 md:p-8 mb-8">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 bg-gradient-taste rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {{ userInitials }}
        </div>
        <div>
          <h1 class="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white">
            {{ userName || 'Guest User' }}
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">
            {{ profileCount }} Taste {{ profileCount === 1 ? 'Profile' : 'Profiles' }}
          </p>
        </div>
      </div>
      
      <div class="flex gap-3">
        <button 
          v-if="isAuthenticated"
          @click="$emit('logout')" 
          class="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
        
        <button 
          v-else
          @click="$emit('login')" 
          class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
          Login
        </button>
        
        <button 
          @click="$emit('settings')" 
          class="px-4 py-2 bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings
        </button>
      </div>
    </div>
    
    <div v-if="showStats" class="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
        <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{ profileCount }}</div>
        <div class="text-sm text-gray-600 dark:text-gray-400">Taste Profiles</div>
      </div>
      
      <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
        <div class="text-2xl font-bold text-taste-food">{{ savedCount }}</div>
        <div class="text-sm text-gray-600 dark:text-gray-400">Saved Items</div>
      </div>
      
      <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
        <div class="text-2xl font-bold text-taste-book">{{ categoriesCount }}</div>
        <div class="text-sm text-gray-600 dark:text-gray-400">Categories</div>
      </div>
      
      <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
        <div class="text-2xl font-bold text-taste-travel">{{ matchCount }}%</div>
        <div class="text-sm text-gray-600 dark:text-gray-400">Avg. Match</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  userName: {
    type: String,
    default: ''
  },
  isAuthenticated: {
    type: Boolean,
    default: false
  },
  profileCount: {
    type: Number,
    default: 0
  },
  savedCount: {
    type: Number,
    default: 0
  },
  categoriesCount: {
    type: Number,
    default: 0
  },
  matchCount: {
    type: Number,
    default: 0
  },
  showStats: {
    type: Boolean,
    default: true
  }
});

defineEmits(['login', 'logout', 'settings']);

// Compute user initials for avatar
const userInitials = computed(() => {
  if (!props.userName) return 'G';
  
  const names = props.userName.split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
});
</script>