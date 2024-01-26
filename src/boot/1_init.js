import { boot } from 'quasar/wrappers';
import axios from 'axios';
import { useAuthStore } from 'src/stores/auth';
import { Cookies } from 'quasar';
import { logout } from 'src/services';
import { useRouter } from 'vue-router';
import { useAsyncState } from '@vueuse/core';

const djangoApi = 'http://127.0.0.1:8000';
const springApi = 'http://localhost:8080';
const isServerRunning = async () => {
  try {
    const response = await axios.get(`${djangoApi}/health-check`);
    if (response.status === 200) {
      console.log('Django 서버 설정. 서버 응답:', response.data);
      const axiosInstance = axios.create({
        baseURL: `${djangoApi}/api/`,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return axiosInstance;
    }
  } catch (error) {
    console.error(
      'Django 서버가 응답하지 않으므로 스프링 서버로 연결됩니다. 서버 응답:',
      error.response ? error.response.data : error.message,
    );
    const axiosInstance = axios.create({
      baseURL: `${springApi}/api/`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return axiosInstance;
  }
};

let api = null;
const setupApi = async () => {
  if (!api) {
    api = await isServerRunning();
  }
  return api;
  // 만료된 access 토큰이면 refresh 토큰을 사용하여 갱신
};
export default boot(async ({ app }) => {
  // 전역 axios 인스턴스를 설정하여, 앱의 모든 곳에서 사용 가능하게 함
  app.config.globalProperties.api = await setupApi();
  api.interceptors.request.use(async config => {
    const accessToken = Cookies.get('access');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });
  api.interceptors.response.use(
    response => response,
    async error => {
      console.log('useerror', error);

      const originalRequest = error.config;
      console.log('originalRequest', originalRequest);
      // AccessToken이 만료되었을 경우 재발급 후 다시 요청
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = Cookies.get('refresh');
        const { error, state } = useAsyncState(
          async () => {
            const response = await api.post('users/token/refresh/', {
              refresh: refreshToken,
            });
            return response;
          },
          {},
          {
            onSuccess: async response => {
              try {
                console.log('state');
                console.log('response');
                const authStore = useAuthStore();
                const newAccessToken = response.data.access;
                authStore.setUserToken(newAccessToken, refreshToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                console.log('api(originalRequest)', api(originalRequest));
                return await api(originalRequest);
              } catch (err) {
                await logout();
                console.log('Register err : ', err.response);
                alert('다시 로그인 하세용');
                window.location.replace('/');
              }
            },
            onError: async err => {},
          },
        );
      }
    },
  );
});

export { api };
