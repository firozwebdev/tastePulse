<template>
  <Teleport to="body">
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-50 overflow-y-auto"
      @click="handleBackdropClick"
    >
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
      
      <!-- Modal -->
      <div class="flex min-h-full items-center justify-center p-4">
        <div 
          class="relative bg-white dark:bg-dark-card rounded-xl shadow-xl max-w-md w-full transform transition-all"
          @click.stop
        >
          <!-- Close Button -->
          <button
            @click="close"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Auth Component -->
          <div class="p-6">
            <Auth 
              :is-login="mode === 'login'" 
              @success="handleSuccess" 
              @mode-change="handleModeChange"
            />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue';
import Auth from './Auth.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  initialMode: {
    type: String,
    default: 'login',
    validator: (value) => ['login', 'signup'].includes(value)
  }
});

const emit = defineEmits(['close', 'success']);

const mode = ref(props.initialMode);

// Watch for prop changes
watch(() => props.initialMode, (newMode) => {
  mode.value = newMode;
});

function handleBackdropClick(event) {
  if (event.target === event.currentTarget) {
    close();
  }
}

function close() {
  emit('close');
}

function handleSuccess() {
  emit('success');
  close();
}

function handleModeChange(newMode) {
  mode.value = newMode;
}
</script>