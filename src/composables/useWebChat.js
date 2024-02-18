import { useWebSocket } from '@vueuse/core';
import { useAuthStore } from 'src/stores/auth';
import { ref, computed } from 'vue';
import { useAsyncState } from '@vueuse/core';
import { getChats } from 'src/services';

const { execute, isLoading } = useAsyncState(getChats, [], {
  immediate: false,
  throwError: true,
  onSuccess: response => {},
  onError: err => {},
});

export const useWebChat = uid => {
  const authStore = useAuthStore();
  const messages = ref([]);
  // const uid = computed(() => {
  //   return authStore.loginUser?.uid || null;
  // });
  console.log(uid, 'vasd');
  if (uid) {
    console.log('websocket');
    const { send, close, open, error, status } = useWebSocket(
      `ws://127.0.0.1:8000/webchat?uid=${uid}`,
      {
        onConnected: async ws => {
          try {
            const chats = await execute();
            console.log(chats);
            messages.value = chats.data;
            // console.log(messages.value);
          } catch (error) {
            console.log(error);
          }
        },
        onDisconnected: (ws, event) => {
          console.log('websocketdisconnected');
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
