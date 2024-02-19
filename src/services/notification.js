import { useWebSocket } from '@vueuse/core';
import { ref } from 'vue';
import { useAsyncState } from '@vueuse/core';
import { jwtApi } from 'src/boot/axios-config';

export async function getNotifications() {
  return await jwtApi.get('notification/');
}

export async function putReadNotification(notId) {
  return await jwtApi.patch(`notification/${notId}`);
}

export const useNotification = uid => {
  const messages = ref([]);
  if (uid) {
    const { execute } = useAsyncState(getNotifications, [], {
      immediate: false,
      throwError: true,
      onSuccess: response => {},
      onError: err => {},
    });
    const { send, close, open, error, status } = useWebSocket(
      `ws://127.0.0.1:8000/notification/${uid}?uid=${uid}`,
      {
        onConnected: async ws => {
          try {
            const notifications = await execute();

            messages.value = notifications.data;
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
          messages.value = [newData.data, ...messages.value];
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
