import { api } from 'src/boot/2_axios-config';
import { useJwt } from '@vueuse/integrations/useJwt';
import { useAuthStore } from 'src/stores/auth';
import { useCookies } from 'vue3-cookies';
const { cookies } = useCookies();

export async function getChats() {
  api.interceptors.request.use(async config => {
    if (!config.headers) return config;
    const accessToken = cookies.get('access');
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });
  return await api.get('webchat/');
}
export async function getNotifications() {
  api.interceptors.request.use(async config => {
    if (!config.headers) return config;
    const accessToken = cookies.get('access');
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });
  return await api.get('notification/');
}

export async function putReadNotification(notId) {
  api.interceptors.request.use(async config => {
    if (!config.headers) return config;
    const accessToken = cookies.get('access');
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });
  return await api.patch(`notification/${notId}`);
}
