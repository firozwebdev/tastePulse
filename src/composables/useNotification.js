import { inject, getCurrentInstance } from 'vue';

export function useNotification() {
  // Try to get the notification manager from injection first
  const injectedManager = inject('notificationManager', null);
  
  // Try to get from global properties as fallback
  const instance = getCurrentInstance();
  const globalManager = instance?.appContext.config.globalProperties.$notificationManager;
  
  // Use the injected manager's value if it's a ref, otherwise use it directly
  const manager = (injectedManager?.value || injectedManager) || globalManager;
  
  if (!manager) {
    console.warn('NotificationManager not found. Make sure it is properly set up in your app.');
    
    // Return dummy functions to prevent errors
    return {
      success: (title, message = '') => console.log(`SUCCESS: ${title} - ${message}`),
      error: (title, message = '') => console.error(`ERROR: ${title} - ${message}`),
      warning: (title, message = '') => console.warn(`WARNING: ${title} - ${message}`),
      info: (title, message = '') => console.info(`INFO: ${title} - ${message}`),
      clearAll: () => console.log('Clear all notifications')
    };
  }
  
  return {
    /**
     * Show a success notification
     * @param {string} title - The notification title
     * @param {string} message - Optional message
     * @param {Object} options - Additional options (duration, autoClose)
     */
    success: (title, message = '', options = {}) => {
      try {
        return manager.success(title, message, options);
      } catch (error) {
        console.error('Notification error:', error);
        console.log(`SUCCESS: ${title} - ${message}`);
      }
    },
    
    /**
     * Show an error notification
     * @param {string} title - The notification title
     * @param {string} message - Optional message
     * @param {Object} options - Additional options (duration, autoClose)
     */
    error: (title, message = '', options = {}) => {
      try {
        return manager.error(title, message, options);
      } catch (error) {
        console.error('Notification error:', error);
        console.error(`ERROR: ${title} - ${message}`);
      }
    },
    
    /**
     * Show a warning notification
     * @param {string} title - The notification title
     * @param {string} message - Optional message
     * @param {Object} options - Additional options (duration, autoClose)
     */
    warning: (title, message = '', options = {}) => {
      try {
        return manager.warning(title, message, options);
      } catch (error) {
        console.error('Notification error:', error);
        console.warn(`WARNING: ${title} - ${message}`);
      }
    },
    
    /**
     * Show an info notification
     * @param {string} title - The notification title
     * @param {string} message - Optional message
     * @param {Object} options - Additional options (duration, autoClose)
     */
    info: (title, message = '', options = {}) => {
      try {
        return manager.info(title, message, options);
      } catch (error) {
        console.error('Notification error:', error);
        console.info(`INFO: ${title} - ${message}`);
      }
    },
    
    /**
     * Clear all notifications
     */
    clearAll: () => {
      try {
        return manager.clearAll();
      } catch (error) {
        console.error('Notification error:', error);
        console.log('Clear all notifications');
      }
    }
  };
}