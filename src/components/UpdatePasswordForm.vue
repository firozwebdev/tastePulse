<template>
  <form @submit.prevent="handleUpdatePassword" class="space-y-6">
    <h3 class="text-xl font-display font-bold text-gray-900 dark:text-white">Change Password</h3>

    <div>
      <label for="newPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
      <input
        id="newPassword"
        v-model="newPassword"
        type="password"
        placeholder="Enter your new password"
        required
        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      />
    </div>

    <div>
      <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
      <input
        id="confirmPassword"
        v-model="confirmPassword"
        type="password"
        placeholder="Confirm your new password"
        required
        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      />
    </div>

    <BaseButton type="submit" :is-loading="isLoading" class="w-full">
      Update Password
    </BaseButton>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { useTasteStore } from '../stores/taste';
import { useNotification } from '../composables/useNotification';
import BaseButton from './BaseButton.vue';

const tasteStore = useTasteStore();
const notification = useNotification();

const newPassword = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);

async function handleUpdatePassword() {
  if (newPassword.value !== confirmPassword.value) {
    notification.error('Passwords do not match', 'Please ensure both password fields are identical.');
    return;
  }

  if (newPassword.value.length < 6) {
    notification.error('Password too short', 'Your new password must be at least 6 characters long.');
    return;
  }

  isLoading.value = true;
  try {
    await tasteStore.updateUserPassword(newPassword.value);
    notification.success('Password Updated', 'Your password has been updated successfully.');
    newPassword.value = '';
    confirmPassword.value = '';
  } catch (error) {
    notification.error('Update Failed', error.message || 'Could not update your password.');
  } finally {
    isLoading.value = false;
  }
}
</script>
