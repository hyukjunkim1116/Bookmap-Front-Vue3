import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useLocalStorage, StorageSerializers } from '@vueuse/core';
import { useCookies } from 'vue3-cookies';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLogin: ref(!!useCookies().cookies.get('access')),
    loginUser: useLocalStorage('auth/user', null, {
      serializer: StorageSerializers.object,
    }),
  }),
  actions: {
    getUid() {
      return this.loginUser.uid || null;
    },
    setAuthentication(value) {
      return (this.isLogin = value);
    },
    getIsLogin() {
      return this.isLogin;
    },
    setUserData(userData) {
      if (userData) {
        const { uid, username, email, image, social, emailVerified } = userData;
        this.loginUser = {
          uid: uid ?? this.loginUser?.uid,
          username: username ?? this.loginUser?.username,
          email: email ?? this.loginUser?.email,
          image: image ?? this.loginUser?.image,
          social: social ?? this.loginUser?.social,
          emailVerified: emailVerified ?? this.loginUser?.emailVerified,
        };
      } else {
        this.loginUser = null;
      }
    },
    setUserToken(access, refresh) {
      const { cookies } = useCookies();
      cookies.set('access', access);
      cookies.set('refresh', refresh);
    },

    getUserData() {
      const storedData = useLocalStorage('auth/user').value;
      if (storedData) {
        const { uid, username, email } = JSON.parse(storedData);
        return { uid, username, email };
      }
      return null;
    },
    hasOwnContent(contentUid) {
      return !!this.isLogin && this.loginUser?.uid == contentUid;
    },
  },
});
