import { api } from 'src/boot/2_axios-config';
import { useCookies } from 'vue3-cookies';
import { useAuthStore } from 'src/stores/auth';
import { logout } from './auth';
const { cookies } = useCookies();
export async function reportPost(postId, data) {
  api.interceptors.request.use(async config => {
    if (!config.headers) return config;
    const accessToken = cookies.get('access');
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
            console.log('here');
            refreshing = true;
            const originalRequest = error.config;
            originalRequest._retry = true;
            const refreshToken = cookies.get('refresh');
            console.log(refreshToken, 'refreshtoken');
            if (!refreshToken) {
              throw new Error('Refresh token not found');
            }
            const response = await api.post('users/token/refresh/', {
              refresh: refreshToken,
            });
            console.log(response, 'response');
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
          console.log('aaaaaaa');
          await logout();
          window.location.replace('/');
          alert('다시 로그인 하세요!!');
          return;
        }
      } else {
        return Promise.reject();
      }
    },
  );
  return await api.post(`reports/${postId}`, data);
}
