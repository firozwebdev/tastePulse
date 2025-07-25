<template>
  <form @submit.prevent="handleUpdateProfile" class="space-y-6">
    <h3 class="text-xl font-display font-bold text-gray-900 dark:text-white">Update Profile</h3>

    <div>
      <label for="fullName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
      <input
        id="fullName"
        v-model="fullName"
        type="text"
        placeholder="Your full name"
        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      />
    </div>

    <div>
      <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
      <input
        id="username"
        v-model="username"
        type="text"
        placeholder="Your username"
        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      />
    </div>

    <BaseButton type="submit" :is-loading="isLoading" class="w-full">
      Save Changes
    </BaseButton>
  </form>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useTasteStore } from '../stores/taste';
import { useNotification } from '../composables/useNotification';
import BaseButton from './BaseButton.vue';

const tasteStore = useTasteStore();
const notification = useNotification();

const fullName = ref('');
const username = ref('');
const isLoading = ref(false);

onMounted(() => {
  const user = tasteStore.user;
  if (user && user.user_metadata) {
    fullName.value = user.user_metadata.full_name || '';
    username.value = user.user_metadata.username || '';
  }
});

async function handleUpdateProfile() {
  isLoading.value = true;
  try {
        await tasteStore.updateUserProfile({
      fullName: fullName.value,
      username: username.value
    });
    notification.success('Profile Updated', 'Your profile has been updated successfully.');
  } catch (error) {
    notification.error('Update Failed', error.message || 'Could not update your profile.');
  } finally {
    isLoading.value = false;
  }
}
</script>
