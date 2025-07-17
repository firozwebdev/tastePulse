<template>
  <div class="fixed top-4 right-4 z-50 space-y-4 max-w-sm w-full">
    <NotificationToast
      v-for="notification in notifications"
      :key="notification.id"
      :type="notification.type"
      :title="notification.title"
      :message="notification.message"
      :duration="notification.duration"
      :auto-close="notification.autoClose"
      @close="removeNotification(notification.id)"
    />
  </div>
</template>

<script setup>
import { useNotifications } from '../composables/useNotifications';
import NotificationToast from './NotificationToast.vue';

const { notifications, removeNotification } = useNotifications();
</script>