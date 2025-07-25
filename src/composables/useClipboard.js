import { ref } from 'vue';
import { useNotification } from './useNotification';

export function useClipboard({ timeout = 2000 } = {}) {
  const copied = ref(false);
  const notification = useNotification();

  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text);
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, timeout);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      notification.error('Copy Failed', 'Could not copy text to clipboard.');
    }
  }

  return { copy, copied };
}
