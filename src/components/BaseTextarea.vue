<template>
  <div class="w-full">
    <!-- Label -->
    <label 
      v-if="label" 
      :for="id" 
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="relative">
      <!-- Textarea element -->
      <textarea
        :id="id"
        :value="modelValue"
        :placeholder="placeholder"
        :rows="rows"
        :disabled="disabled"
        :required="required"
        :maxlength="maxLength"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${id}-error` : helpText ? `${id}-help` : undefined"
        :class="[
          'w-full rounded-lg border px-4 py-2 transition-all duration-300',
          disabled ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : 'bg-white dark:bg-gray-900',
          error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-700 focus:ring-primary-500 focus:border-primary-500',
          isOverMaxLength ? 'border-red-500' : '',
          className
        ]"
        @input="handleInput"
        @blur="handleBlur"
        @focus="$emit('focus', $event)"
      ></textarea>
      
      <!-- Character count -->
      <div 
        v-if="maxLength" 
        class="absolute bottom-2 right-2 text-xs"
        :class="isOverMaxLength ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'"
      >
        {{ modelValue.length }}/{{ maxLength }}
      </div>
    </div>
    
    <!-- Error message -->
    <p 
      v-if="error" 
      :id="`${id}-error`" 
      class="mt-1 text-sm text-red-600 dark:text-red-400"
      role="alert"
    >
      {{ error }}
    </p>
    
    <!-- Length error message -->
    <p 
      v-else-if="isOverMaxLength" 
      class="mt-1 text-sm text-red-600 dark:text-red-400"
      role="alert"
    >
      Text exceeds maximum length of {{ maxLength }} characters
    </p>
    
    <!-- Help text -->
    <p 
      v-else-if="helpText" 
      :id="`${id}-help`" 
      class="mt-1 text-sm text-gray-500 dark:text-gray-400"
    >
      {{ helpText }}
    </p>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, nextTick } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  rows: {
    type: Number,
    default: 4
  },
  id: {
    type: String,
    default: () => `textarea-${Math.random().toString(36).substring(2, 9)}`
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  helpText: {
    type: String,
    default: ''
  },
  maxLength: {
    type: Number,
    default: null
  },
  validateOnBlur: {
    type: Boolean,
    default: false
  },
  minLength: {
    type: Number,
    default: null
  },
  className: {
    type: String,
    default: ''
  },
  autoResize: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'error', 'valid']);

// Computed property to check if text exceeds maxLength
const isOverMaxLength = computed(() => {
  return props.maxLength && props.modelValue.length > props.maxLength;
});

// Handle input event
function handleInput(event) {
  const value = event.target.value;
  emit('update:modelValue', value);
  
  // Auto-resize textarea if enabled
  if (props.autoResize) {
    autoResize(event.target);
  }
  
  // Validate on input if not set to validate on blur
  if (!props.validateOnBlur) {
    validateInput(value);
  }
}

// Handle blur event
function handleBlur(event) {
  emit('blur', event);
  
  // Validate on blur if set
  if (props.validateOnBlur) {
    validateInput(event.target.value);
  }
}

// Validate input value
function validateInput(value) {
  // Required validation
  if (props.required && !value.trim()) {
    emit('error', 'This field is required');
    return false;
  }
  
  // Min length validation
  if (props.minLength && value.length < props.minLength) {
    emit('error', `Minimum length is ${props.minLength} characters`);
    return false;
  }
  
  // Max length validation
  if (props.maxLength && value.length > props.maxLength) {
    emit('error', `Maximum length is ${props.maxLength} characters`);
    return false;
  }
  
  // Valid input
  emit('valid', true);
  return true;
}

// Auto-resize textarea function
function autoResize(textarea) {
  if (!textarea) return;
  
  // Reset height to get the correct scrollHeight
  textarea.style.height = 'auto';
  
  // Set the height to match content
  textarea.style.height = `${textarea.scrollHeight}px`;
}

// Apply auto-resize on mount if enabled
onMounted(() => {
  if (props.autoResize && props.modelValue) {
    nextTick(() => {
      const textarea = document.getElementById(props.id);
      if (textarea) {
        autoResize(textarea);
      }
    });
  }
});
</script>