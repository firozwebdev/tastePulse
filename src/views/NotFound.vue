<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12">
    <div class="max-w-md w-full text-center">
      <div class="mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-primary-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 class="text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">Page Not Found</h1>
      <p class="text-lg text-gray-600 dark:text-gray-400 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <router-link 
        to="/" 
        class="px-6 py-3 bg-gradient-taste text-white font-medium rounded-lg shadow-taste hover:shadow-taste-hover transition-all duration-300 inline-block"
      >
        Go Back Home
      </router-link>
    </div>
  </div>
</template>

<script setup>
// No additional logic needed
</script>