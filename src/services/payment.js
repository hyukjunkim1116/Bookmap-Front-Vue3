import { api } from 'src/boot/2_axios-config';
import { useCookies } from 'vue3-cookies';
const { cookies } = useCookies();
export async function payToPortOne(data) {
  api.interceptors.request.use(async config => {
    if (!config.headers) return config;
    const accessToken = cookies.get('access');
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });
  console.log(data);
  return await api.post(`payments/pay`, data);
}
export async function getPaymentsHistory() {
  api.interceptors.request.use(async config => {
    if (!config.headers) return config;
    const accessToken = cookies.get('access');
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });
  return await api.get(`payments/pay`);
}
