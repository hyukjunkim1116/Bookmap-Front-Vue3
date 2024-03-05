import axios from 'axios';
import { boot } from 'quasar/wrappers';
import { useCookies } from 'vue3-cookies';
import { useAuthStore } from 'src/stores/auth';
import { logout } from 'src/services';
const djangoApi = 'http://localhost:8000';
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
    console.log(
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

let jwtApi = null;
const setupjwtApi = async () => {
  if (!jwtApi) {
    const { cookies } = useCookies();
    jwtApi = await isServerRunning();
    jwtApi.interceptors.request.use(async config => {
      if (!config.headers) return config;
      const accessToken = cookies.get('access');
      if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    });

    jwtApi.interceptors.response.use(
      response => response,
      async error => {
        if (error.config && error.response && error.response.status === 401) {
          try {
            const refreshApi = await isServerRunning();
            const { cookies } = useCookies();
            const authStore = useAuthStore();
            const originalRequest = error.config;
            const refreshToken = cookies.get('refresh');
            originalRequest._retry = true;
            if (!refreshToken) {
              throw new Error('Refresh token not found');
            }
            const response = await refreshApi.post(`users/token/refresh/`, {
              refresh: refreshToken,
            });
            const newAccessToken = response.data.access;

            authStore.setUserToken(newAccessToken, refreshToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return jwtApi(originalRequest);
          } catch (e) {
            console.log(e);
            await logout();
            return Promise.reject(e);
          }
        }
      },
    );
  }
  return jwtApi;
};
let formApi = null;
const setupformApi = async () => {
  if (!formApi) {
    const { cookies } = useCookies();
    formApi = await isServerRunning();
    formApi.interceptors.request.use(async config => {
      if (!config.headers) return config;
      const accessToken = cookies.get('access');
      if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
        config.headers['Content-Type'] = 'multipart/form-data';
      }
      return config;
    });
    formApi.interceptors.response.use(
      response => response,
      async error => {
        if (error.config && error.response && error.response.status === 401) {
          try {
            console.log('formApi');
            const refreshApi = await isServerRunning();
            const { cookies } = useCookies();
            const authStore = useAuthStore();
            const originalRequest = error.config;
            const refreshToken = cookies.get('refresh');
            originalRequest._retry = true;
            if (!refreshToken) {
              throw new Error('Refresh token not found');
            }
            const response = await refreshApi.post(`users/token/refresh/`, {
              refresh: refreshToken,
            });
            const newAccessToken = response.data.access;

            authStore.setUserToken(newAccessToken, refreshToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return formApi(originalRequest);
          } catch (e) {
            console.log(e);
            await logout();
            return Promise.reject(e);
          }
        }
      },
    );
  }
  return formApi;
};
export default boot(async ({ app }) => {
  app.config.globalProperties.api = await setupApi();
  app.config.globalProperties.jwtApi = await setupjwtApi();
  app.config.globalProperties.formApi = await setupformApi();
});
export { api, jwtApi, formApi };
