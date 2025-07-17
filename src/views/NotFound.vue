<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12">
    <div class="max-w-md w-full text-center">
      <div class="mb-8 animate-float">
        <div class="relative w-32 h-32 mx-auto">
          <div class="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full animate-pulse-glow"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <h1 class="text-4xl font-display font-bold gradient-text mb-4 animate-slide-in-bottom">
        Page Not Found
      </h1>
      
      <p class="text-lg text-gray-600 dark:text-gray-400 mb-8 animate-slide-in-bottom delay-100">
        The page you're looking for doesn't exist or has been moved.
      </p>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center animate-slide-in-bottom delay-200">
        <router-link 
          to="/" 
          class="px-6 py-3 bg-gradient-taste text-white font-medium rounded-lg shadow-taste hover:shadow-taste-hover transition-all duration-300 inline-flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Go Back Home
        </router-link>
        
        <button 
          @click="goBack" 
          class="px-6 py-3 bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 font-medium rounded-lg hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors inline-flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Go Back
        </button>
      </div>
      
      <div class="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-in-bottom delay-300">
        <router-link to="/" class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <div class="text-sm font-medium text-gray-900 dark:text-white">Home</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Start exploring</div>
        </router-link>
        
        <router-link to="/profile" class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <div class="text-sm font-medium text-gray-900 dark:text-white">Profiles</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Your taste profiles</div>
        </router-link>
        
        <router-link to="/about" class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <div class="text-sm font-medium text-gray-900 dark:text-white">About</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Learn more</div>
        </router-link>
        
        <a href="mailto:contact@tastepulse.app" class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <div class="text-sm font-medium text-gray-900 dark:text-white">Contact</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Get help</div>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function goBack() {
  router.go(-1);
}
</script>