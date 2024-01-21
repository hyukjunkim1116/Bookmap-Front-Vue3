import { Cookies } from 'quasar';
import { defineStore } from 'pinia';
import { computed } from 'vue';

// auth 상태 및 관련 로직을 다루는 Vue Pinia 스토어를 정의합니다.
export const useLoginStore = defineStore('isLogin', {
  state: () => ({
    isLogin: Cookies.has('access'), // 로그인 상태를 저장하는 상태
  }),
  actions: {
    setAuthentication(value) {
      return (this.isLogin = value);
    },
  },
});
