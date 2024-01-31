import { Cookies } from 'quasar';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useLocalStorage, StorageSerializers } from '@vueuse/core';
// auth 상태 및 관련 로직을 다루는 Vue Pinia 스토어를 정의합니다.
export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLogin: ref(Cookies.has('access')),
    loginUser: useLocalStorage('auth/user', null, {
      serializer: StorageSerializers.object,
    }),
  }),
  actions: {
    setAuthentication(value) {
      return (this.isLogin = value);
    },
    getIsLogin() {
      return this.isLogin;
    },
    setUserData(userData) {
      if (userData) {
        this.loginUser = {
          uid: userData.uid,
          username: userData.username,
          email: userData.email,
        };
      } else {
        this.loginUser = null;
      }
    },
    setUserToken(access, refresh) {
      try {
        Cookies.set('access', access);
        Cookies.set('refresh', refresh);
      } catch {
        return null;
      }
    },
    getUserData() {
      const storedData = useLocalStorage('auth/user').value;
      const parsedData = JSON.parse(storedData);
      const uid = parsedData.payload.uid;
      const username = parsedData.payload.username;
      const email = parsedData.payload.email;
      return { uid, username, email };
    },
    hasOwnContent(contentUid) {
      // 사용자가 인증되어 있지 않으면 소유자가 아니라고 판단합니다.
      if (!this.isLogin) {
        return false;
      }
      // 사용자의 UID와 컨텐츠의 UID를 비교하여 소유자 여부를 판단합니다.
      return this.loginUser.uid === contentUid;
    },
  },
});
