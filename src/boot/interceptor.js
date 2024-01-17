import { boot } from 'quasar/wrappers';
import { api } from './init';
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
import { useAuthStore } from 'src/stores/auth'; // 사용자 인증 상태를 관리하는 스토어 경로에 맞게 수정 필요
export default boot(async (/* { app, router, ... } */) => {
  // 요청 인터셉터 설정
  api.interceptors.request.use(
    config => {
      // Auth 스토어에서 토큰을 가져옴
      const authStore = useAuthStore();
      const token = authStore.user.value?.access;

      // 토큰이 존재하면 헤더에 추가
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );

  // 응답 인터셉터 설정
  api.interceptors.response.use(
    response => {
      // 응답이 성공적으로 받아지면 해당 응답 반환
      return response;
    },
    error => {
      // 응답이 에러인 경우
      if (error.response) {
        // 토큰 만료 에러 처리
        if (error.response.status === 401) {
          // Auth 스토어에서 로그아웃 메서드 호출
          const authStore = useAuthStore();
          authStore.setUser(null);
        }
      }
      // Promise를 통해 에러 전파
      return Promise.reject(error);
    },
  );
});
