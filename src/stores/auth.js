// Vue 및 Pinia에서 사용할 컴포지션 API를 import 합니다.
import { computed } from 'vue';
import { Cookies, uid } from 'quasar';
import { defineStore } from 'pinia';
import { useLocalStorage, StorageSerializers } from '@vueuse/core';

export const useAuthStore = defineStore('auth', () => {
  const loginUser = useLocalStorage('auth/user', null, {
    serializer: StorageSerializers.object,
  });
  const uid = computed(() => loginUser.value?.payload.uid || null);
  const setUserData = userData => {
    if (userData) {
      loginUser.value = {
        payload: {
          uid: userData.uid,
          username: userData.username,
          email: userData.email,
        },
      };
    } else {
      loginUser.value = null;
    }
  };
  const setUserToken = (access, refresh) => {
    try {
      Cookies.set('access', access);
      Cookies.set('refresh', refresh);
    } catch {
      return null;
    }
  };
  const getUserData = computed(() => {
    const storedData = useLocalStorage('auth/user').value;
    const parsedData = JSON.parse(storedData);
    const uid = parsedData.payload.uid;
    const username = parsedData.payload.username;
    const email = parsedData.payload.email;
    return { uid, username, email };
  });
  return {
    loginUser,
    uid,
    setUserData,
    setUserToken,
    getUserData,
  };
});
