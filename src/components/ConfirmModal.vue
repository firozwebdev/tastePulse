<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click="handleBackdropClick">
    <div class="bg-white dark:bg-dark-card rounded-xl shadow-xl max-w-md w-full" @click.stop>
      <!-- Header -->
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-4">
          <!-- Icon -->
          <div 
            :class="[
              'w-12 h-12 rounded-full flex items-center justify-center',
              iconColorClasses
            ]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPath" />
            </svg>
          </div>
          
          <!-- Title and Description -->
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ title }}
            </h3>
            <p v-if="description" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {{ description }}
            </p>
          </div>
        </div>
      </div>
      
      <!-- Content -->
      <div v-if="$slots.default" class="p-6">
        <slot />
      </div>
      
      <!-- Actions -->
      <div class="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
        <BaseButton
          @click="handleCancel"
          variant="secondary"
          :disabled="loading"
        >
          {{ cancelText }}
        </BaseButton>
        
        <BaseButton
          @click="handleConfirm"
          :variant="confirmVariant"
          :loading="loading"
          :disabled="loading"
        >
          {{ confirmText }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import BaseButton from './BaseButton.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  type: {
    type: String,
    default: 'warning',
    validator: (value) => ['info', 'warning', 'danger', 'success'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['confirm', 'cancel', 'close']);

const confirmVariant = computed(() => {
  const variants = {
    info: 'primary',
    warning: 'warning',
    danger: 'danger',
    success: 'success'
  };
  return variants[props.type];
});

const iconColorClasses = computed(() => {
  const colors = {
    info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    danger: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
  };
  return colors[props.type];
});

const iconPath = computed(() => {
  const paths = {
    info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z',
    danger: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z',
    success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  };
  return paths[props.type];
});

function handleConfirm() {
  emit('confirm');
}

function handleCancel() {
  emit('cancel');
  emit('close');
}

function handleBackdropClick() {
  if (props.closeOnBackdrop && !props.loading) {
    emit('close');
  }
}
</script>