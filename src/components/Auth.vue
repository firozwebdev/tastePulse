<template>
  <div class="bg-white dark:bg-dark-card rounded-xl shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border p-6 md:p-8 max-w-md mx-auto">
    <!-- Header -->
    <div class="text-center mb-8">
      <div class="w-16 h-16 bg-gradient-taste rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <h2 class="text-2xl font-display font-bold text-gray-900 dark:text-white">
        {{ isLogin ? 'Welcome Back' : 'Create Account' }}
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mt-2">
        {{ isLogin ? 'Sign in to access your taste profiles' : 'Join TastePulse to save and share your taste profiles' }}
      </p>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Email -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          :class="{ 'border-red-500 dark:border-red-500': errors.email }"
        />
        <p v-if="errors.email" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.email }}</p>
      </div>

      <!-- Password -->
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
        <div class="relative">
          <input
            id="password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            required
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white pr-10"
            :class="{ 'border-red-500 dark:border-red-500': errors.password }"
          />
          <button 
            type="button" 
            @click="showPassword = !showPassword"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400"
          >
            <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
        <p v-if="errors.password" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.password }}</p>
      </div>

      <!-- Confirm Password (Sign Up only) -->
      <div v-if="!isLogin">
        <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
        <input
          id="confirmPassword"
          v-model="confirmPassword"
          type="password"
          required
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          :class="{ 'border-red-500 dark:border-red-500': errors.confirmPassword }"
        />
        <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.confirmPassword }}</p>
      </div>

      <!-- Forgot Password (Login only) -->
      <div v-if="isLogin" class="flex justify-end">
        <button 
          type="button" 
          @click="forgotPassword"
          class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors"
        >
          Forgot password?
        </button>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        class="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        :disabled="isLoading"
      >
        <svg v-if="isLoading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ isLogin ? 'Sign In' : 'Create Account' }}
      </button>

      <!-- Demo User Button -->
      <button
        type="button"
        @click="loginAsDemo"
        class="w-full py-3 px-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        :disabled="isLoading"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        Try Demo Account
      </button>
    </form>

    <!-- Toggle Login/Signup -->
    <div class="mt-6 text-center">
      <p class="text-gray-600 dark:text-gray-400">
        {{ isLogin ? "Don't have an account?" : 'Already have an account?' }}
        <button 
          type="button" 
          @click="toggleMode"
          class="ml-1 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors font-medium"
        >
          {{ isLogin ? 'Sign Up' : 'Sign In' }}
        </button>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useTasteStore } from '../stores/taste';
import { useNotification } from '../composables/useNotification';
import supabase from '../utils/supabase';

const props = defineProps({
  isLogin: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['success', 'mode-change']);

const tasteStore = useTasteStore();
const notification = useNotification();

// Form state
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const isLoading = ref(false);
const errors = ref({});

// Computed properties
const mode = computed(() => props.isLogin ? 'login' : 'signup');

// Methods
async function handleSubmit() {
  // Reset errors
  errors.value = {};
  
  // Validate form
  if (!email.value) {
    errors.value.email = 'Email is required';
  } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
    errors.value.email = 'Please enter a valid email address';
  }
  
  if (!password.value) {
    errors.value.password = 'Password is required';
  } else if (password.value.length < 6) {
    errors.value.password = 'Password must be at least 6 characters';
  }
  
  if (!props.isLogin && password.value !== confirmPassword.value) {
    errors.value.confirmPassword = 'Passwords do not match';
  }
  
  // If there are errors, don't submit
  if (Object.keys(errors.value).length > 0) {
    return;
  }
  
  isLoading.value = true;
  
  try {
    if (props.isLogin) {
      // Login with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value
      });
      
      if (error) throw error;
      
      // Update store with user data
      await tasteStore.setUser(data.user);
      
      notification.success('Welcome back!', 'You have successfully signed in.');
    } else {
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value
      });
      
      if (error) throw error;
      
      // Check if email confirmation is required
      if (data?.user?.identities?.length === 0) {
        notification.info(
          'Email already registered', 
          'This email is already registered. Please sign in instead.'
        );
        emit('mode-change', 'login');
        return;
      }
      
      if (data?.user?.confirmed_at) {
        // User is already confirmed, log them in
        await tasteStore.setUser(data.user);
        notification.success('Account created!', 'Your account has been created successfully.');
      } else {
        // User needs to confirm their email
        notification.info(
          'Confirm your email', 
          'Please check your email for a confirmation link to complete your registration.'
        );
      }
    }
    
    emit('success');
  } catch (error) {
    console.error('Authentication error:', error);
    
    // Handle specific error cases
    if (error.message.includes('Invalid login credentials')) {
      notification.error('Authentication failed', 'Invalid email or password. Please try again.');
    } else {
      notification.error(
        'Authentication error', 
        error.message || 'An error occurred during authentication. Please try again.'
      );
    }
  } finally {
    isLoading.value = false;
  }
}

function toggleMode() {
  emit('mode-change', props.isLogin ? 'signup' : 'login');
}

async function loginAsDemo() {
  isLoading.value = true;
  
  try {
    // Use the demo account credentials
    const demoEmail = 'demo@tastepulse.app';
    const demoPassword = 'tastepulse123';
    
    // Try to login with demo credentials
    const { data, error } = await supabase.auth.signInWithPassword({
      email: demoEmail,
      password: demoPassword
    });
    
    // If demo user doesn't exist, create it
    if (error && error.message.includes('Invalid login credentials')) {
      // Create demo user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: demoEmail,
        password: demoPassword,
        options: {
          data: {
            name: 'Demo User',
            avatar_url: null
          }
        }
      });
      
      if (signUpError) throw signUpError;
      
      // If demo user was created successfully, log them in
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword
      });
      
      if (loginError) throw loginError;
      
      await tasteStore.setUser(loginData.user);
    } else if (error) {
      throw error;
    } else {
      // Login successful
      await tasteStore.setUser(data.user);
    }
    
    notification.success('Welcome, Demo User!', 'You are now signed in with the demo account.');
    emit('success');
  } catch (error) {
    console.error('Demo login error:', error);
    notification.error(
      'Demo login failed', 
      'Could not access the demo account. Please try again or create your own account.'
    );
  } finally {
    isLoading.value = false;
  }
}

async function forgotPassword() {
  if (!email.value) {
    errors.value.email = 'Please enter your email address';
    return;
  }
  
  isLoading.value = true;
  
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    
    if (error) throw error;
    
    notification.success(
      'Password reset email sent', 
      'Please check your email for a link to reset your password.'
    );
  } catch (error) {
    console.error('Password reset error:', error);
    notification.error(
      'Password reset failed', 
      error.message || 'Could not send password reset email. Please try again.'
    );
  } finally {
    isLoading.value = false;
  }
}
</script>