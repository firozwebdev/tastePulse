<template>
  <div class="bg-white dark:bg-dark-card rounded-xl shadow-card-light dark:shadow-card-dark border border-gray-100 dark:border-dark-border p-6">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Account Settings</h3>
    
    <!-- Profile Information -->
    <div class="space-y-6">
      <!-- Avatar Section -->
      <div class="flex items-center space-x-4">
        <div class="w-16 h-16 bg-gradient-taste rounded-full flex items-center justify-center text-white text-xl font-bold">
          {{ user?.name?.charAt(0)?.toUpperCase() || 'U' }}
        </div>
        <div>
          <h4 class="text-sm font-medium text-gray-900 dark:text-white">Profile Picture</h4>
          <p class="text-sm text-gray-500 dark:text-gray-400">Update your profile picture</p>
          <button 
            @click="uploadAvatar"
            class="mt-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors"
          >
            Change Avatar
          </button>
        </div>
      </div>

      <!-- Name -->
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
        <input
          id="name"
          v-model="profileData.name"
          type="text"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      <!-- Email (Read-only) -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
        <input
          id="email"
          :value="user?.email"
          type="email"
          readonly
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
        />
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Email cannot be changed</p>
      </div>

      <!-- Username -->
      <div>
        <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
        <input
          id="username"
          v-model="profileData.username"
          type="text"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      <!-- Save Button -->
      <button
        @click="saveProfile"
        :disabled="isSaving"
        class="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <svg v-if="isSaving" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ isSaving ? 'Saving...' : 'Save Changes' }}
      </button>
    </div>

    <!-- Divider -->
    <div class="my-8 border-t border-gray-200 dark:border-gray-700"></div>

    <!-- Password Change -->
    <div class="space-y-6">
      <h4 class="text-md font-medium text-gray-900 dark:text-white">Change Password</h4>
      
      <!-- Current Password -->
      <div>
        <label for="currentPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
        <input
          id="currentPassword"
          v-model="passwordData.current"
          type="password"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      <!-- New Password -->
      <div>
        <label for="newPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
        <input
          id="newPassword"
          v-model="passwordData.new"
          type="password"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      <!-- Confirm New Password -->
      <div>
        <label for="confirmNewPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
        <input
          id="confirmNewPassword"
          v-model="passwordData.confirm"
          type="password"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      <!-- Change Password Button -->
      <button
        @click="changePassword"
        :disabled="isChangingPassword || !canChangePassword"
        class="w-full py-2 px-4 bg-secondary-600 hover:bg-secondary-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <svg v-if="isChangingPassword" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ isChangingPassword ? 'Changing...' : 'Change Password' }}
      </button>
    </div>

    <!-- Divider -->
    <div class="my-8 border-t border-gray-200 dark:border-gray-700"></div>

    <!-- Danger Zone -->
    <div class="space-y-4">
      <h4 class="text-md font-medium text-red-600 dark:text-red-400">Danger Zone</h4>
      
      <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <h5 class="text-sm font-medium text-red-800 dark:text-red-200 mb-2">Delete Account</h5>
        <p class="text-sm text-red-600 dark:text-red-300 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button
          @click="confirmDeleteAccount"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
        >
          Delete Account
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useTasteStore } from '../stores/taste';
import { useNotification } from '../composables/useNotification';

const tasteStore = useTasteStore();
const notification = useNotification();

// State
const isSaving = ref(false);
const isChangingPassword = ref(false);

const profileData = ref({
  name: '',
  username: ''
});

const passwordData = ref({
  current: '',
  new: '',
  confirm: ''
});

// Computed
const user = computed(() => tasteStore.user);

const canChangePassword = computed(() => {
  return passwordData.value.current && 
         passwordData.value.new && 
         passwordData.value.confirm && 
         passwordData.value.new === passwordData.value.confirm &&
         passwordData.value.new.length >= 6;
});

// Methods
onMounted(() => {
  if (user.value) {
    profileData.value.name = user.value.name || '';
    profileData.value.username = user.value.username || '';
  }
});

async function saveProfile() {
  isSaving.value = true;
  
  try {
    await tasteStore.updateUserProfile({
      fullName: profileData.value.name,
      username: profileData.value.username
    });
    
    notification.success('Profile Updated', 'Your profile has been successfully updated.');
  } catch (error) {
    console.error('Error updating profile:', error);
    notification.error('Update Failed', error.message || 'Could not update your profile. Please try again.');
  } finally {
    isSaving.value = false;
  }
}

async function changePassword() {
  if (!canChangePassword.value) {
    notification.error('Invalid Password', 'Please ensure all password fields are filled and match.');
    return;
  }
  
  isChangingPassword.value = true;
  
  try {
    await tasteStore.updateUserPassword(passwordData.value.new);
    
    // Clear password fields
    passwordData.value = {
      current: '',
      new: '',
      confirm: ''
    };
    
    notification.success('Password Changed', 'Your password has been successfully updated.');
  } catch (error) {
    console.error('Error changing password:', error);
    notification.error('Password Change Failed', error.message || 'Could not change your password. Please try again.');
  } finally {
    isChangingPassword.value = false;
  }
}

function uploadAvatar() {
  // TODO: Implement avatar upload functionality
  notification.info('Coming Soon', 'Avatar upload functionality will be available soon.');
}

function confirmDeleteAccount() {
  if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    deleteAccount();
  }
}

async function deleteAccount() {
  try {
    // TODO: Implement account deletion
    notification.info('Coming Soon', 'Account deletion functionality will be available soon.');
  } catch (error) {
    console.error('Error deleting account:', error);
    notification.error('Deletion Failed', 'Could not delete your account. Please contact support.');
  }
}
</script>