<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div 
        class="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" 
        aria-hidden="true"
        @click="close"
      ></div>

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <!-- Modal panel -->
      <div 
        class="inline-block align-bottom bg-transparent rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        @click.stop
      >
        <div class="relative">
          <!-- Close button -->
          <button 
            @click="close" 
            class="absolute top-4 right-4 z-10 p-2 rounded-full bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <span class="sr-only">Close</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Auth component -->
          <Auth 
            :is-login="mode === 'login'" 
            @success="handleSuccess" 
            @mode-change="handleModeChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import Auth from './Auth.vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  initialMode: {
    type: String,
    default: 'login',
    validator: (value) => ['login', 'signup'].includes(value)
  }
});

const emit = defineEmits(['update:show', 'success']);

// State
const mode = ref(props.initialMode);

// Reset mode when modal is opened
watch(() => props.show, (newValue) => {
  if (newValue) {
    mode.value = props.initialMode;
  }
});

// Methods
function close() {
  emit('update:show', false);
}

function handleSuccess() {
  emit('success');
  close();
}

function handleModeChange(newMode) {
  mode.value = newMode;
}
</script>