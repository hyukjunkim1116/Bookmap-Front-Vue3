import { api } from 'src/boot/2_axios-config';
import { useCookies } from 'vue3-cookies';
const { cookies } = useCookies();
export async function payToKakao() {
  api.interceptors.request.use(async config => {
    if (!config.headers) return config;
    const accessToken = cookies.get('access');
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });
  return await api.post(`payments/kakaopay`);
}
