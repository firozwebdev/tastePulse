<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-dark-bg">
    <div class="w-full max-w-md space-y-8">
      <!-- Logo and header -->
      <div class="text-center">
        <div class="flex justify-center">
          <div class="w-20 h-20 bg-gradient-taste rounded-full flex items-center justify-center text-white text-3xl font-bold">
            TP
          </div>
        </div>
        <h1 class="mt-6 text-3xl font-display font-bold text-gray-900 dark:text-white">
          TastePulse
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Discover recommendations based on your unique taste profile
        </p>
      </div>

      <!-- Auth component -->
      <Auth 
        :is-login="mode === 'login'" 
        @success="handleSuccess" 
        @mode-change="handleModeChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTasteStore } from '../stores/taste';
import Auth from '../components/Auth.vue';

const route = useRoute();
const router = useRouter();
const tasteStore = useTasteStore();

// State
const mode = ref('login');

// Set initial mode based on route query parameter
onMounted(() => {
  if (route.query.mode === 'signup') {
    mode.value = 'signup';
  }
  
  // If user is already authenticated, redirect to home
  if (tasteStore.isAuthenticated) {
    router.push('/');
  }
});

// Methods
function handleSuccess() {
  // Redirect to home page or the page they were trying to access
  const redirectPath = route.query.redirect || '/';
  router.push(redirectPath);
}

function handleModeChange(newMode) {
  mode.value = newMode;
  
  // Update URL query parameter without reloading the page
  router.replace({ query: { ...route.query, mode: newMode } });
}
</script>