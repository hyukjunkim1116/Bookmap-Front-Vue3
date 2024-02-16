import { api } from 'src/boot/2_axios-config';
import { useJwt } from '@vueuse/integrations/useJwt';
import { useAuthStore } from 'src/stores/auth';
import { useCookies } from 'vue3-cookies';
const { cookies } = useCookies();

const DEFAULT_PHOTO_URL =
  'https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=';
export function generateDefaultPhotoURL(uid) {
  return `${DEFAULT_PHOTO_URL}${uid}`;
}
export async function sendVerificationEmail(uid) {
  api.interceptors.request.use(async config => {
    if (!config.headers) return config;
    const accessToken = cookies.get('access');
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });
  return await api.post(`users/${uid}/verify/`);
}
export async function signUpWithEmail(data) {
  return await api.post('users/', data);
}
export async function signInWithEmail(data) {
  const authStore = useAuthStore();
  const response = await api.post('users/login/', data);
  const access = response.data.access;
  const refresh = response.data.refresh;
  const email = response.data.email;
  const username = response.data.username;
  const image = response.data?.image;
  const social = response.data.social;
  const emailVerified = response.data.is_verified;
  authStore.setUserToken(access, refresh);
  const { payload } = useJwt(access);
  authStore.setUserData({
    email,
    username,
    uid: payload.value.user_id,
    image,
    social,
    emailVerified,
  });

  return response.data;
}
export async function signInWithKakao(data) {
  const authStore = useAuthStore();
  console.log(data, 'data');
  const response = await api.post(`users/kakao/`, data);
  console.log(response, response.data);
  const access = response.data.access;
  const refresh = response.data.refresh;
  const email = response.data.email;
  const username = response.data.username;
  const image = response.data?.image;
  const social = response.data.social;
  const emailVerified = response.data.is_verified;
  console.log(access, refresh);
  authStore.setUserToken(access, refresh);
  const { payload } = useJwt(access);
  console.log(payload, 'payload');
  authStore.setUserData({
    email,
    username,
    uid: payload.value.user_id,
    image,
    social,
    emailVerified,
  });
  return response.data;
}

export async function logout() {
  const { cookies } = useCookies();
  cookies.remove('access');
  cookies.remove('refresh');
  localStorage.removeItem('auth/user');
  return;
}
export async function findPasswordWithEmail(data) {
  api.interceptors.request.use(async config => {
    if (!config.headers) return config;
    const accessToken = cookies.get('access');
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });
  return await api.put(`users/find-password/`, data);
}
export async function updateUserPassword(data) {
  api.interceptors.request.use(async config => {
    if (!config.headers) return config;
    const accessToken = cookies.get('access');
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });
  return await api.put(`users/change-password/`, data);
}
export async function updateUserProfile(data, uid) {
  api.interceptors.request.use(async config => {
    if (!config.headers) return config;
    const accessToken = cookies.get('access');
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });
  return await api.put(`users/${uid}/`, data);
}
export async function updateUserImage(data, uid) {
  api.interceptors.request.use(async config => {
    if (!config.headers) return config;
    const accessToken = cookies.get('access');
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      config.headers['Content-Type'] = 'multipart/form-data';
    }
    return config;
  });
  // api.interceptors.request.use(config => {
  //   config.headers['Content-Type'] = 'multipart/form-data';
  //   return config;
  // });
  return await api.patch(`users/${uid}/image`, data);
}
export async function deleteUser(uid) {
  api.interceptors.request.use(async config => {
    if (!config.headers) return config;
    const accessToken = cookies.get('access');
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });
  return await api.delete(`users/${uid}/`);
}
