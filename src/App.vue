<script setup>
import { ref, onMounted, watch, getCurrentInstance, provide } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import NotificationManager from './components/NotificationManager.vue';
import LanguageSelector from './components/LanguageSelector.vue';
import AuthModal from './components/AuthModal.vue';
import { useTheme } from './composables/useTheme.js';
import { useTasteStore } from './stores/taste';

// Use theme composable
const { isDarkMode, toggleDarkMode, initializeTheme, watchSystemTheme } = useTheme();

// Store
const tasteStore = useTasteStore();
const router = useRouter();

// UI state
const isMobileMenuOpen = ref(false);
const isAuthModalOpen = ref(false);
const authModalMode = ref('login');

function closeAuthModal() {
  isAuthModalOpen.value = false;
  if (tasteStore.isAuthModalOpen) {
    tasteStore.isAuthModalOpen = false;
  }
}

// Language state
const selectedLanguage = ref('en');

// Toggle mobile menu
function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
}

// Auth functions
function openLogin() {
  authModalMode.value = 'login';
  isAuthModalOpen.value = true;
  isMobileMenuOpen.value = false;
}

function openSignup() {
  authModalMode.value = 'signup';
  isAuthModalOpen.value = true;
  isMobileMenuOpen.value = false;
}

async function handleLogout() {
  await tasteStore.logout();
  router.push('/');
}

// Change language
function changeLanguage(langCode) {
  selectedLanguage.value = langCode;
  // In a real app, this would trigger translations to be loaded
  console.log(`Language changed to: ${langCode}`);
}

// Close mobile menu when route changes
const route = useRoute();
watch(() => route.path, () => {
  isMobileMenuOpen.value = false;
});

// Watch for requests from the store to open the auth modal
watch(() => tasteStore.isAuthModalOpen, (newValue) => {
  if (newValue) {
    authModalMode.value = 'login'; // Default to login when opened from store
    isAuthModalOpen.value = true;
  }
});

// Notification manager ref
const notificationManager = ref(null);

// Create a reactive notification manager object that will be provided
const notificationService = {
  success: (title, message = '', options = {}) => {
    if (notificationManager.value) {
      return notificationManager.value.success(title, message, options);
    }
    console.log(`SUCCESS: ${title} - ${message}`);
  },
  error: (title, message = '', options = {}) => {
    if (notificationManager.value) {
      return notificationManager.value.error(title, message, options);
    }
    console.error(`ERROR: ${title} - ${message}`);
  },
  warning: (title, message = '', options = {}) => {
    if (notificationManager.value) {
      return notificationManager.value.warning(title, message, options);
    }
    console.warn(`WARNING: ${title} - ${message}`);
  },
  info: (title, message = '', options = {}) => {
    if (notificationManager.value) {
      return notificationManager.value.info(title, message, options);
    }
    console.info(`INFO: ${title} - ${message}`);
  },
  clearAll: () => {
    if (notificationManager.value) {
      return notificationManager.value.clearAll();
    }
    console.log('Clear all notifications');
  }
};

// Provide notification service to child components
provide('notificationManager', notificationService);

// Initialize theme and watch for system changes
onMounted(() => {
  initializeTheme();
  watchSystemTheme();
  
  // Set up global notification manager after component is mounted
  if (notificationManager.value) {
    const app = getCurrentInstance()?.appContext.app;
    if (app) {
      app.config.globalProperties.$notificationManager = notificationService;
    }
  }
});
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-gray-100 transition-colors duration-300">
    <!-- Notifications -->
    <NotificationManager ref="notificationManager" />
    
    <!-- Navigation -->
    <header class="bg-white dark:bg-dark-card shadow-sm border-b border-gray-200 dark:border-dark-border sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo and main nav -->
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <router-link to="/" class="flex items-center">
                <div class="w-8 h-8 bg-gradient-taste rounded-full flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                </div>
                <span class="text-xl font-display font-bold text-gray-900 dark:text-white">TastePulse</span>
              </router-link>
            </div>
            
            <!-- Desktop Navigation -->
            <nav class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link to="/" class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium" :class="[$route.path === '/' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700']">
                Home
              </router-link>
              <router-link to="/profile" class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium" :class="[$route.path === '/profile' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700']">
                My Profiles
              </router-link>
              <router-link to="/about" class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium" :class="[$route.path === '/about' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700']">
                About
              </router-link>
            </nav>
          </div>
          
          <!-- Right side buttons -->
          <div class="flex items-center gap-3">
            <!-- Auth buttons (desktop) -->
            <template v-if="!tasteStore.isAuthenticated">
              <button
                @click="openLogin"
                class="hidden sm:inline-flex items-center px-3 py-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md"
              >
                Sign In
              </button>
              <button
                @click="openSignup"
                class="hidden sm:inline-flex items-center px-3 py-1.5 text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                Sign Up
              </button>
            </template>
            
            <!-- User menu (desktop) -->
            <div v-else class="hidden sm:block relative">
              <button
                @click="handleLogout"
                class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md"
              >
                <span class="mr-2">{{ tasteStore.user?.name || 'User' }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
            
            <!-- Language Selector -->
            <LanguageSelector 
              :selected-language="selectedLanguage" 
              @change="changeLanguage"
              class="hidden md:block"
            />
            
            <!-- Dark mode toggle -->
            <button 
              @click="toggleDarkMode" 
              class="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-transform duration-300 transform hover:scale-110 active:scale-95"
              title="Toggle dark mode"
            >
              <svg v-if="isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
            
            <!-- Mobile menu button -->
            <button 
              @click="toggleMobileMenu" 
              class="sm:hidden p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-transform duration-300 transform hover:scale-110 active:scale-95"
              title="Toggle menu"
            >
              <svg v-if="!isMobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Mobile menu -->
      <div v-if="isMobileMenuOpen" class="sm:hidden bg-white dark:bg-dark-card border-t border-gray-200 dark:border-dark-border">
        <div class="pt-2 pb-3 space-y-1">
          <!-- Auth buttons (mobile) -->
          <template v-if="!tasteStore.isAuthenticated">
            <button
              @click="openLogin"
              class="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
            >
              Sign In
            </button>
            <button
              @click="openSignup"
              class="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
            >
              Sign Up
            </button>
          </template>
          
          <!-- User menu (mobile) -->
          <button
            v-else
            @click="handleLogout"
            class="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
          >
            Sign Out
          </button>
          <router-link to="/" class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium" :class="[$route.path === '/' ? 'border-primary-500 text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/10' : 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700']">
            Home
          </router-link>
          <router-link to="/profile" class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium" :class="[$route.path === '/profile' ? 'border-primary-500 text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/10' : 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700']">
            My Profiles
          </router-link>
          <router-link to="/about" class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium" :class="[$route.path === '/about' ? 'border-primary-500 text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/10' : 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700']">
            About
          </router-link>
        </div>
        
        <!-- Mobile Language Selector -->
        <div class="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Language</span>
            <LanguageSelector 
              :selected-language="selectedLanguage" 
              @change="changeLanguage"
            />
          </div>
        </div>
      </div>
    </header>
    
    <!-- Main Content -->
    <main class="flex-grow">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <!-- Auth Modal -->
    <AuthModal 
      :is-open="isAuthModalOpen" 
      :initial-mode="authModalMode"
      @close="closeAuthModal"
      @success="closeAuthModal"
    />
    
    <!-- Footer -->
    <footer class="bg-white dark:bg-dark-card border-t border-gray-200 dark:border-dark-border py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="flex items-center mb-4 md:mb-0">
            <div class="w-6 h-6 bg-gradient-taste rounded-full flex items-center justify-center mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
            </div>
            <span class="text-sm font-medium text-gray-900 dark:text-white">TastePulse</span>
          </div>
          
          <div class="text-sm text-gray-500 dark:text-gray-400">
            &copy; {{ new Date().getFullYear() }} TastePulse. All rights reserved.
          </div>
          
          <div class="flex space-x-4 mt-4 md:mt-0">
            <a href="#" class="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" class="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
              </svg>
            </a>
            <a href="#" class="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clip-rule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
/* Global styles */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
