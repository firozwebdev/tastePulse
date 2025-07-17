<template>
  <div class="fixed top-4 right-4 z-50 space-y-4 max-w-sm w-full pointer-events-none">
    <transition-group name="notification">
      <div 
        v-for="notification in notifications" 
        :key="notification.id"
        class="bg-white dark:bg-dark-card shadow-lg rounded-lg pointer-events-auto ring-1 overflow-hidden transform transition-all duration-300"
        :class="[
          notification.type === 'success' ? 'ring-green-500' : 
          notification.type === 'error' ? 'ring-red-500' : 
          notification.type === 'warning' ? 'ring-yellow-500' : 
          'ring-primary-500'
        ]"
      >
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <!-- Success Icon -->
              <svg
                v-if="notification.type === 'success'"
                class="h-6 w-6 text-green-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              
              <!-- Error Icon -->
              <svg
                v-else-if="notification.type === 'error'"
                class="h-6 w-6 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              
              <!-- Warning Icon -->
              <svg
                v-else-if="notification.type === 'warning'"
                class="h-6 w-6 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              
              <!-- Info Icon -->
              <svg
                v-else
                class="h-6 w-6 text-primary-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p class="text-sm font-medium text-gray-900 dark:text-white">{{ notification.title }}</p>
              <p v-if="notification.message" class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ notification.message }}</p>
              
              <!-- Progress bar -->
              <div 
                v-if="notification.autoClose" 
                class="mt-2 h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
              >
                <div 
                  class="h-full rounded-full transition-all duration-100 ease-linear"
                  :class="[
                    notification.type === 'success' ? 'bg-green-500' : 
                    notification.type === 'error' ? 'bg-red-500' : 
                    notification.type === 'warning' ? 'bg-yellow-500' : 
                    'bg-primary-500'
                  ]"
                  :style="{ width: `${notification.progress}%` }"
                ></div>
              </div>
            </div>
            
            <div class="ml-4 flex-shrink-0 flex">
              <button
                @click="closeNotification(notification.id)"
                class="bg-white dark:bg-dark-card rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <span class="sr-only">Close</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const notifications = ref([]);
const notificationTimers = {};

// Add a new notification
function addNotification({ type = 'info', title, message = '', duration = 5000, autoClose = true }) {
  const id = Date.now();
  
  const notification = {
    id,
    type,
    title,
    message,
    duration,
    autoClose,
    progress: 100
  };
  
  notifications.value.push(notification);
  
  if (autoClose) {
    startProgressTimer(id, duration);
  }
  
  return id;
}

// Start the progress timer for auto-closing notifications
function startProgressTimer(id, duration) {
  const startTime = Date.now();
  const endTime = startTime + duration;
  
  const updateProgress = () => {
    const now = Date.now();
    const timeLeft = Math.max(0, endTime - now);
    const progress = (timeLeft / duration) * 100;
    
    const notification = notifications.value.find(n => n.id === id);
    if (notification) {
      notification.progress = progress;
      
      if (progress <= 0) {
        closeNotification(id);
      } else {
        notificationTimers[id] = requestAnimationFrame(updateProgress);
      }
    }
  };
  
  notificationTimers[id] = requestAnimationFrame(updateProgress);
}

// Close a notification
function closeNotification(id) {
  const index = notifications.value.findIndex(n => n.id === id);
  if (index !== -1) {
    notifications.value.splice(index, 1);
    
    if (notificationTimers[id]) {
      cancelAnimationFrame(notificationTimers[id]);
      delete notificationTimers[id];
    }
  }
}

// Helper functions for different notification types
function success(title, message = '', options = {}) {
  return addNotification({ type: 'success', title, message, ...options });
}

function error(title, message = '', options = {}) {
  return addNotification({ type: 'error', title, message, duration: 7000, ...options });
}

function warning(title, message = '', options = {}) {
  return addNotification({ type: 'warning', title, message, ...options });
}

function info(title, message = '', options = {}) {
  return addNotification({ type: 'info', title, message, ...options });
}

// Clear all notifications
function clearAll() {
  notifications.value = [];
  
  // Cancel all timers
  Object.keys(notificationTimers).forEach(id => {
    cancelAnimationFrame(notificationTimers[id]);
    delete notificationTimers[id];
  });
}

// Clean up timers when component is unmounted
onBeforeUnmount(() => {
  Object.keys(notificationTimers).forEach(id => {
    cancelAnimationFrame(notificationTimers[id]);
  });
});

// Expose methods to parent components
defineExpose({
  success,
  error,
  warning,
  info,
  clearAll
});
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>