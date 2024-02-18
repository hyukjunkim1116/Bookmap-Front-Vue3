import { useWebSocket } from '@vueuse/core';
import { useAuthStore } from 'src/stores/auth';
import { ref, computed } from 'vue';
import { useAsyncState } from '@vueuse/core';
import { getNotifications } from 'src/services';
const { execute, isLoading } = useAsyncState(getNotifications, [], {
  immediate: false,
  throwError: true,
  onSuccess: response => {
    console.log('seuccess');
  },
  onError: err => {},
});
export const useNotification = uid => {
  const authStore = useAuthStore();
  const messages = ref([]);
  // const uid = computed(() => {
  //   return authStore.loginUser?.uid || null;
  // });
  // console.log(uid, 'uid');
  console.log(uid, 'uid123');
  if (uid) {
    console.log('useNotification');
    const { send, close, open, error, status } = useWebSocket(
      `ws://127.0.0.1:8000/notification/${uid}?uid=${uid}`,
      {
        onConnected: async ws => {
          console.log('onConnected');
          try {
            const notifications = await execute();

            messages.value = notifications.data;
            console.log(messages.value, '3243');
          } catch (error) {
            console.log(error);
          }
        },
        onDisconnected: (ws, event) => {
          console.log('disconnects');
          if (event.code == 4001) {
            console.log('Authentication Error');
          }
        },
        onMessage: (ws, msg) => {
          const newData = JSON.parse(msg.data);
          messages.value = [newData.data, ...messages.value];
          console.log(messages.value, 'msg');
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
