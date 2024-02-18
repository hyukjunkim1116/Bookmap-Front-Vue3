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
    jwtApi = await isServerRunning();
    jwtApi.interceptors.request.use(async config => {
      if (!config.headers) return config;
      const accessToken = cookies.get('access');
      if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    });
    let refreshing = false;
    jwtApi.interceptors.response.use(
      response => response,
      async error => {
        if (error.config && error.response && error.response.status === 401) {
          if (!refreshing) {
            try {
              const { cookies } = useCookies();

              refreshing = true;
              const originalRequest = error.config;
              originalRequest._retry = true;
              const refreshToken = cookies.get('refresh');

              if (!refreshToken) {
                throw new Error('Refresh token not found');
              }
              const response = await jwtApi.post('users/token/refresh/', {
                refresh: refreshToken,
              });

              const authStore = useAuthStore();
              const newAccessToken = response.data.access;
              authStore.setUserToken(newAccessToken, refreshToken);
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

              return api(originalRequest);
            } catch {
              await logout();
              window.location.replace('/');
              alert('다시 로그인 하세요!!');
              return;
            }
          } else {
            await logout();
            window.location.replace('/');
            alert('다시 로그인 하세요!!');
            return;
          }
        } else {
          return;
        }
      },
    );
  }
  return jwtApi;
};
let formApi = null;
const setupformApi = async () => {
  if (!formApi) {
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
    let refreshing = false;
    formApi.interceptors.response.use(
      response => response,
      async error => {
        if (error.config && error.response && error.response.status === 401) {
          if (!refreshing) {
            try {
              const { cookies } = useCookies();

              refreshing = true;
              const originalRequest = error.config;
              originalRequest._retry = true;
              const refreshToken = cookies.get('refresh');

              if (!refreshToken) {
                throw new Error('Refresh token not found');
              }
              const response = await formApi.post('users/token/refresh/', {
                refresh: refreshToken,
              });

              const authStore = useAuthStore();
              const newAccessToken = response.data.access;
              authStore.setUserToken(newAccessToken, refreshToken);
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

              return api(originalRequest);
            } catch {
              await logout();
              window.location.replace('/');
              alert('다시 로그인 하세요!!');
              return;
            }
          } else {
            await logout();
            window.location.replace('/');
            alert('다시 로그인 하세요!!');
            return;
          }
        } else {
          return;
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
