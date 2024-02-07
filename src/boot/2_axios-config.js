import axios from 'axios';
import { boot } from 'quasar/wrappers';
import { useAuthStore } from 'src/stores/auth';
import { Cookies } from 'quasar';
import { logout } from 'src/services';
const djangoApi = 'http://127.0.0.1:8000';
const springApi = 'http://localhost:8080';
const isServerRunning = async () => {
  try {
    const response = await axios.get(`${djangoApi}/health-check`);
    if (response.status === 200) {
      console.log('Django 서버 설정. 서버 응답:', response.status);
      const axiosInstance = axios.create({
        baseURL: `${djangoApi}/api/`,
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      return axiosInstance;
    }
  } catch (error) {
    console.error(
      'Django 서버가 응답하지 않으므로 스프링 서버로 연결됩니다. 서버 응답:',
      error.status || '200',
    );
    const axiosInstance = axios.create({
      baseURL: `${springApi}/api/`,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
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
};
export default boot(async ({ app }) => {
  app.config.globalProperties.api = await setupApi();

  api.interceptors.request.use(async config => {
    if (!config.headers) return config;
    const accessToken = Cookies.get('access');
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  let refreshing = false;

  api.interceptors.response.use(
    response => response,
    async error => {
      if (error.config && error.response && error.response.status === 401) {
        if (!refreshing) {
          try {
            refreshing = true;

            const originalRequest = error.config;
            originalRequest._retry = true;
            const refreshToken = Cookies.get('refresh');

            if (!refreshToken) {
              throw new Error('Refresh token not found');
            }

            const response = await api.post('users/token/refresh/', {
              refresh: refreshToken,
            });

            const authStore = useAuthStore();
            const newAccessToken = response.data.access;
            authStore.setUserToken(newAccessToken, refreshToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            // Reset the refreshing flag before making the retry request
            refreshing = false;

            return api(originalRequest);
          } catch (err) {
            await logout();
            alert('다시 로그인 하세요');
            window.location.replace('/');
          }
        } else {
          alert('관리자에게 문의하세요!');
        }
      }
      return Promise.reject(error);
    },
  );
});
export { api };
