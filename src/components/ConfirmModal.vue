<template>
  <transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" @click.self="handleCancel">
      <transition name="slide-up">
        <div v-if="isOpen" class="relative w-full max-w-md p-8 m-4 bg-gray-800 border border-gray-700 rounded-2xl shadow-xl transform transition-all">
          <h3 class="text-2xl font-bold text-white mb-4">{{ title }}</h3>
          <p class="text-gray-300 mb-8">{{ message }}</p>
          <div class="flex justify-end space-x-4">
            <button @click="handleCancel" class="px-6 py-2 text-white bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors duration-200 font-semibold">
              Cancel
            </button>
            <button @click="handleConfirm" :class="['px-6 py-2 text-white rounded-lg transition-colors duration-200 font-semibold', confirmButtonClass]">
              {{ confirmText }}
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Are you sure?'
  },
  message: {
    type: String,
    default: 'This action cannot be undone.'
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  confirmClass: {
    type: String,
    default: 'danger' // 'danger', 'primary', etc.
  }
});

const emit = defineEmits(['confirm', 'cancel']);

const handleConfirm = () => {
  emit('confirm');
};

const handleCancel = () => {
  emit('cancel');
};

const confirmButtonClass = computed(() => {
  switch (props.confirmClass) {
    case 'danger':
      return 'bg-red-600 hover:bg-red-500';
    case 'primary':
      return 'bg-indigo-600 hover:bg-indigo-500';
    default:
      return 'bg-gray-700 hover:bg-gray-600';
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
