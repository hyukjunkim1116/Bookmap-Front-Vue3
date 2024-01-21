// Vue 및 Pinia에서 사용할 컴포지션 API를 import 합니다.
import { computed } from 'vue';
import { Cookies } from 'quasar';
import { defineStore } from 'pinia';
import { useCookies } from '@vueuse/integrations/useCookies';
// @vueuse/core에서 제공하는 useLocalStorage 및 StorageSerializers를 import 합니다.
import { useLocalStorage, StorageSerializers } from '@vueuse/core';

// auth 상태 및 관련 로직을 다루는 Vue Pinia 스토어를 정의합니다.
export const useAuthStore = defineStore('auth', () => {
  // useLocalStorage를 사용하여 'auth/user' 키에 대한 로컬 스토리지를 설정하고,
  // StorageSerializers.object를 사용하여 객체를 직렬화합니다.
  const user = useLocalStorage('auth/user', null, {
    serializer: StorageSerializers.object,
  });
  // 사용자가 인증되어 있는지 여부를 계산하는 computed 속성을 정의합니다.
  // const isAuthenticated = computed(
  //   () => Cookies.has('access'),
  //   console.log('Coo:', Cookies.has('access')),
  // );
  const isAuthenticated = computed(() => !!Cookies.has('access'));
  // 사용자의 UID를 반환하는 computed 속성을 정의합니다.
  const uid = computed(() => user.value?.uid || null);

  // 사용자 정보를 설정하는 setUser 메서드를 정의합니다.
  const setUserData = userData => {
    if (userData) {
      // 사용자 데이터가 전달되면 해당 데이터로 사용자 정보를 설정합니다.
      user.value = {
        payload: {
          uid: userData.uid,
          username: userData.username,
          email: userData.email,
        },
      };
    } else {
      // 사용자 데이터가 없으면 사용자 정보를 null로 설정합니다.
      user.value = null;
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
  // 특정 컨텐츠의 소유자인지 여부를 확인하는 메서드를 정의합니다.
  const hasOwnContent = contentUid => {
    // 사용자가 인증되어 있지 않으면 소유자가 아니라고 판단합니다.
    if (!isAuthenticated.value) {
      return false;
    }
    // 사용자의 UID와 컨텐츠의 UID를 비교하여 소유자 여부를 판단합니다.
    return uid.value === contentUid;
  };

  // 스토어에서 사용할 속성과 메서드를 반환합니다.
  return {
    user,
    uid,
    isAuthenticated,
    setUserData,
    setUserToken,
    hasOwnContent,
  };
});
