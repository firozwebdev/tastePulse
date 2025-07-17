import { ref, reactive } from 'vue';

const notifications = ref([]);

export function useNotifications() {
  function addNotification(notification) {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'info',
      duration: 5000,
      autoClose: true,
      ...notification
    };
    
    notifications.value.push(newNotification);
    
    return id;
  }
  
  function removeNotification(id) {
    const index = notifications.value.findIndex(n => n.id === id);
    if (index > -1) {
      notifications.value.splice(index, 1);
    }
  }
  
  function success(title, message = '', options = {}) {
    return addNotification({
      type: 'success',
      title,
      message,
      ...options
    });
  }
  
  function error(title, message = '', options = {}) {
    return addNotification({
      type: 'error',
      title,
      message,
      duration: 7000, // Longer duration for errors
      ...options
    });
  }
  
  function warning(title, message = '', options = {}) {
    return addNotification({
      type: 'warning',
      title,
      message,
      ...options
    });
  }
  
  function info(title, message = '', options = {}) {
    return addNotification({
      type: 'info',
      title,
      message,
      ...options
    });
  }
  
  function clear() {
    notifications.value = [];
  }
  
  return {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    warning,
    info,
    clear
  };
}