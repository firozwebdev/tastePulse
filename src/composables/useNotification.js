import { inject, getCurrentInstance } from 'vue';

export function useNotification() {
  // Try to get the notification manager from the current component instance
  const instance = getCurrentInstance();
  const notificationManager = instance?.appContext.config.globalProperties.$notificationManager;
  
  // If notification manager is not available through global properties, try to get it from the parent component
  const parentNotificationManager = inject('notificationManager', null);
  
  // Use whichever is available
  const manager = notificationManager || parentNotificationManager;
  
  if (!manager) {
    console.warn('NotificationManager not found. Make sure it is properly set up in your app.');
    
    // Return dummy functions to prevent errors
    return {
      success: () => console.warn('NotificationManager not available'),
      error: () => console.warn('NotificationManager not available'),
      warning: () => console.warn('NotificationManager not available'),
      info: () => console.warn('NotificationManager not available'),
      clearAll: () => console.warn('NotificationManager not available')
    };
  }
  
  return {
    /**
     * Show a success notification
     * @param {string} title - The notification title
     * @param {string} message - Optional message
     * @param {Object} options - Additional options (duration, autoClose)
     */
    success: (title, message = '', options = {}) => manager.success(title, message, options),
    
    /**
     * Show an error notification
     * @param {string} title - The notification title
     * @param {string} message - Optional message
     * @param {Object} options - Additional options (duration, autoClose)
     */
    error: (title, message = '', options = {}) => manager.error(title, message, options),
    
    /**
     * Show a warning notification
     * @param {string} title - The notification title
     * @param {string} message - Optional message
     * @param {Object} options - Additional options (duration, autoClose)
     */
    warning: (title, message = '', options = {}) => manager.warning(title, message, options),
    
    /**
     * Show an info notification
     * @param {string} title - The notification title
     * @param {string} message - Optional message
     * @param {Object} options - Additional options (duration, autoClose)
     */
    info: (title, message = '', options = {}) => manager.info(title, message, options),
    
    /**
     * Clear all notifications
     */
    clearAll: () => manager.clearAll()
  };
}