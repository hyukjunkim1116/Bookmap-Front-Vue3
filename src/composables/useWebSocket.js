import { useWebSocket } from '@vueuse/core';
import { useAuthStore } from 'src/stores/auth';
import { ref } from 'vue';
import { useAsyncState } from '@vueuse/core';
import { getChats } from 'src/services';
const authStore = useAuthStore();
const uid = authStore.loginUser?.uid || null;
const { execute, isLoading } = useAsyncState(getChats, [], {
  immediate: false,
  throwError: true,
  onSuccess: response => {},
  onError: err => {},
});
export const useWebSocketQuery = () => {
  if (uid) {
    const messages = ref([]);
    const { data, send, close, open, error } = useWebSocket(
      `ws://127.0.0.1:8000?uid=${uid}`,
      {
        onConnected: async ws => {
          try {
            const chats = await execute();

            messages.value = chats.data;
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
          console.log('onmessage', msg.data, ws);
          const newData = JSON.parse(msg.data);
          console.log(newData, 'newdata');
          console.log(data.value, 'databeforevalue');
          messages.value = messages.value.push(newData);
          console.log(messages.value, 'datavalue');
        },
      },
    );
    return {
      data,
      send,
      open,
      close,
      error,
    };
  }
};
