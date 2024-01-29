import { Cookies } from 'quasar';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useLocalStorage, StorageSerializers } from '@vueuse/core';
// auth 상태 및 관련 로직을 다루는 Vue Pinia 스토어를 정의합니다.
export const useLoginStore = defineStore('isLogin', {
  state: () => ({
    isLogin: ref(Cookies.has('access')),
    loginUser: useLocalStorage('auth/user', null, {
      serializer: StorageSerializers.object,
    }),
    // 로그인 상태를 저장하는 상태
  }),
  actions: {
    getUid() {
      computed(() => this.loginUser.value?.payload.uid || null);
    },
    setAuthentication(value) {
      return (this.isLogin = value);
    },
    getIsLogin() {
      return this.isLogin;
    },
    hasOwnContent(contentUid) {
      if (!this.isLogin) {
        return false;
      }
      return this.uid.value === contentUid;
    },
    setUserData(userData) {
      if (userData) {
        this.loginUser.value = {
          payload: {
            uid: userData.uid,
            username: userData.username,
            email: userData.email,
          },
        };
      } else {
        this.loginUser.value = null;
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
      return this.uid.value === contentUid;
    },
  },
});
