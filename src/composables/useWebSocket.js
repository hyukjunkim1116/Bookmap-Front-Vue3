import { useWebSocket } from '@vueuse/core';
import { useAuthStore } from 'src/stores/auth';
import { ref, computed } from 'vue';
import { useAsyncState } from '@vueuse/core';
import { getChats } from 'src/services';
const authStore = useAuthStore();
const { execute, isLoading } = useAsyncState(getChats, [], {
  immediate: false,
  throwError: true,
  onSuccess: response => {},
  onError: err => {},
});

export const useWebSocketQuery = () => {
  const messages = ref([]);
  const uid = computed(() => {
    return authStore.loginUser?.uid || null;
  });
  console.log(uid.value, 'uid123');
  if (uid.value) {
    console.log('websocket');
    const { send, close, open, error, status } = useWebSocket(
      `ws://127.0.0.1:8000?uid=${uid.value}`,
      {
        autoReconnect: {
          retries: 3,
          delay: 1000,
        },

        onConnected: async ws => {
          try {
            const chats = await execute();
            messages.value = chats.data;
            // console.log(messages.value);
          } catch (error) {
            console.log(error);
          }
        },
        onDisconnected: (ws, event) => {
          if (event.code == 4001) {
            console.log('Authentication Error');
          }
        },
        onMessage: (ws, msg) => {
          const newData = JSON.parse(msg.data);
          messages.value = [...messages.value, newData.new_message];
        },
      },
    );
    return {
      status,
      messages,
      send,
      open,
      close,
      error,
      uid,
    };
  }
};
