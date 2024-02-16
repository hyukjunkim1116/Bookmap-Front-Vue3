import { useWebSocket } from '@vueuse/core';
import { useAuthStore } from 'src/stores/auth';
import { ref, computed } from 'vue';
// import { useAsyncState } from '@vueuse/core';
// import { getChats } from 'src/services';
export const useNotification = () => {
  const authStore = useAuthStore();
  const notification = ref([]);
  const uid = computed(() => {
    return authStore.loginUser?.uid || null;
  });
  console.log(uid.value, 'uid123');
  if (uid.value) {
    console.log('useNotification');
    const { send, close, open, error, status } = useWebSocket(
      `ws://127.0.0.1:8000/notification?uid=${uid.value}`,
      {
        onConnected: async ws => {
          try {
          } catch (error) {
            console.log(error);
          }
        },
        onDisconnected: (ws, event) => {
          if (event.code == 4001) {
            console.log('Authentication Error');
          }
        },
        onMessage: (ws, msg) => {},
      },
    );
    return {
      status,
      notification,
      send,
      open,
      close,
      error,
      uid,
    };
  }
};
