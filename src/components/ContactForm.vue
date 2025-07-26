<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click="handleBackdropClick">
    <div class="bg-white dark:bg-dark-card rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
      <!-- Header -->
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-2xl font-display font-bold text-gray-900 dark:text-white">Contact Us</h3>
            <p class="text-gray-600 dark:text-gray-400 mt-1">We'd love to hear from you. Send us a message!</p>
          </div>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="p-6 space-y-6">
        <!-- Contact Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">What can we help you with?</label>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              v-for="type in contactTypes"
              :key="type.value"
              type="button"
              @click="formData.type = type.value"
              :class="[
                'p-4 rounded-lg border-2 transition-all duration-200 text-left',
                formData.type === type.value
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              ]"
            >
              <div class="flex items-center gap-3">
                <div :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center',
                  formData.type === type.value
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                ]">
                  <component :is="type.icon" class="h-4 w-4" />
                </div>
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">{{ type.label }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">{{ type.description }}</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        <!-- Name -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              First Name *
            </label>
            <BaseInput
              id="firstName"
              v-model="formData.firstName"
              placeholder="Enter your first name"
              :error="errors.firstName"
              required
            />
          </div>
          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Last Name *
            </label>
            <BaseInput
              id="lastName"
              v-model="formData.lastName"
              placeholder="Enter your last name"
              :error="errors.lastName"
              required
            />
          </div>
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Address *
          </label>
          <BaseInput
            id="email"
            v-model="formData.email"
            type="email"
            placeholder="Enter your email address"
            :error="errors.email"
            required
          />
        </div>

        <!-- Subject -->
        <div>
          <label for="subject" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Subject *
          </label>
          <BaseInput
            id="subject"
            v-model="formData.subject"
            placeholder="Brief description of your inquiry"
            :error="errors.subject"
            required
          />
        </div>

        <!-- Message -->
        <div>
          <label for="message" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Message *
          </label>
          <BaseTextarea
            id="message"
            v-model="formData.message"
            rows="5"
            placeholder="Tell us more about your inquiry..."
            :error="errors.message"
            required
          />
        </div>

        <!-- Priority -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority Level</label>
          <div class="flex gap-3">
            <button
              v-for="priority in priorities"
              :key="priority.value"
              type="button"
              @click="formData.priority = priority.value"
              :class="[
                'px-4 py-2 rounded-lg border transition-all duration-200 flex items-center gap-2',
                formData.priority === priority.value
                  ? `border-${priority.color}-500 bg-${priority.color}-50 dark:bg-${priority.color}-900/20 text-${priority.color}-700 dark:text-${priority.color}-300`
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
              ]"
            >
              <div :class="[
                'w-2 h-2 rounded-full',
                formData.priority === priority.value ? `bg-${priority.color}-500` : 'bg-gray-400'
              ]"></div>
              {{ priority.label }}
            </button>
          </div>
        </div>

        <!-- Consent -->
        <div class="flex items-start gap-3">
          <input
            id="consent"
            v-model="formData.consent"
            type="checkbox"
            class="mt-1 w-4 h-4 text-primary-600 border-gray-300 dark:border-gray-700 rounded focus:ring-primary-500"
            required
          />
          <label for="consent" class="text-sm text-gray-600 dark:text-gray-400">
            I agree to the <a href="#" class="text-primary-600 dark:text-primary-400 hover:underline">Privacy Policy</a> 
            and consent to TastePulse storing my information for the purpose of responding to my inquiry. *
          </label>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end gap-3 pt-4">
          <BaseButton
            type="button"
            variant="secondary"
            @click="$emit('close')"
            :disabled="isSubmitting"
          >
            Cancel
          </BaseButton>
          <BaseButton
            type="submit"
            :loading="isSubmitting"
            :disabled="!isFormValid || isSubmitting"
          >
            <template #icon-left v-if="!isSubmitting">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </template>
            {{ isSubmitting ? 'Sending...' : 'Send Message' }}
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue';
import { useNotification } from '../composables/useNotification';
import BaseInput from './BaseInput.vue';
import BaseTextarea from './BaseTextarea.vue';
import BaseButton from './BaseButton.vue';
import supabase from '../utils/supabase';

const emit = defineEmits(['close']);
const notification = useNotification();

// Contact types with icons
const contactTypes = [
  {
    value: 'support',
    label: 'Support',
    description: 'Technical issues or bugs',
    icon: h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z'
      })
    ])
  },
  {
    value: 'feedback',
    label: 'Feedback',
    description: 'Suggestions or improvements',
    icon: h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z'
      })
    ])
  },
  {
    value: 'business',
    label: 'Business',
    description: 'Partnerships or collaborations',
    icon: h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6'
      })
    ])
  }
];

const priorities = [
  { value: 'low', label: 'Low', color: 'green' },
  { value: 'medium', label: 'Medium', color: 'yellow' },
  { value: 'high', label: 'High', color: 'red' }
];

// Form data
const formData = ref({
  type: 'support',
  firstName: '',
  lastName: '',
  email: '',
  subject: '',
  message: '',
  priority: 'medium',
  consent: false
});

const errors = ref({});
const isSubmitting = ref(false);

// Computed
const isFormValid = computed(() => {
  return formData.value.firstName &&
         formData.value.lastName &&
         formData.value.email &&
         formData.value.subject &&
         formData.value.message &&
         formData.value.consent;
});

// Methods
function validateForm() {
  errors.value = {};
  
  if (!formData.value.firstName) {
    errors.value.firstName = 'First name is required';
  }
  
  if (!formData.value.lastName) {
    errors.value.lastName = 'Last name is required';
  }
  
  if (!formData.value.email) {
    errors.value.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.value.email = 'Please enter a valid email address';
  }
  
  if (!formData.value.subject) {
    errors.value.subject = 'Subject is required';
  }
  
  if (!formData.value.message) {
    errors.value.message = 'Message is required';
  } else if (formData.value.message.length < 10) {
    errors.value.message = 'Message must be at least 10 characters long';
  }
  
  return Object.keys(errors.value).length === 0;
}

async function submitForm() {
  if (!validateForm()) {
    notification.error('Form Error', 'Please fix the errors and try again.');
    return;
  }
  
  isSubmitting.value = true;
  
  try {
    // Save to Supabase
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([{
        type: formData.value.type,
        first_name: formData.value.firstName,
        last_name: formData.value.lastName,
        email: formData.value.email,
        subject: formData.value.subject,
        message: formData.value.message,
        priority: formData.value.priority,
        status: 'new',
        created_at: new Date().toISOString()
      }]);
    
    if (error) throw error;
    
    notification.success('Message Sent!', 'Thank you for contacting us. We\'ll get back to you soon.');
    emit('close');
    
    // Reset form
    formData.value = {
      type: 'support',
      firstName: '',
      lastName: '',
      email: '',
      subject: '',
      message: '',
      priority: 'medium',
      consent: false
    };
    
  } catch (error) {
    console.error('Error submitting contact form:', error);
    notification.error('Send Failed', 'Could not send your message. Please try again or email us directly.');
  } finally {
    isSubmitting.value = false;
  }
}

function handleBackdropClick() {
  emit('close');
}
</script>