import { api } from 'src/boot/2_axios-config';
import { useJwt } from '@vueuse/integrations/useJwt';
import { useAuthStore } from 'src/stores/auth';
import { Cookies } from 'quasar';
import { useCookies } from 'vue3-cookies';
// auth 상태 및 관련 로직을 다루는 Vue Pinia 스토어를 정의합니다.
const { cookies } = useCookies();
const DEFAULT_PHOTO_URL =
  'https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=';
export function generateDefaultPhotoURL(uid) {
  return `${DEFAULT_PHOTO_URL}${uid}`;
}
export async function signUpWithEmail(data) {
  return await api.post('users/', data);
}
export async function signInWithEmail(data) {
  const authStore = useAuthStore();
  const response = await api.post('users/login/', data);
  console.log(response.data);
  const access = response.data.access;
  const refresh = response.data.refresh;
  const email = response.data.email;
  const username = response.data.username;
  const image = response.data?.image;
  const social = response.data.social;
  authStore.setUserToken(access, refresh);
  const { payload } = useJwt(access);
  console.log(payload);
  authStore.setUserData({
    email,
    username,
    uid: payload.value.user_id,
    image,
    social,
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
  });
  return response.data;
}

export async function logout() {
  const { cookies } = useCookies();
  cookies.remove('access');
  cookies.remove('refresh');
  localStorage.removeItem('auth/user');
}
export async function findPasswordWithEmail(data) {
  return await api.put(`users/find-password/`, data);
}
export async function updateUserPassword(data) {
  return await api.put(`users/change-password/`, data);
}
export async function updateUserProfile(data, uid) {
  return await api.put(`users/${uid}/`, data);
}
export async function updateUserImage(data, uid) {
  api.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'multipart/form-data';
    return config;
  });
  return await api.patch(`users/${uid}/image`, data);
}
export async function deleteUser(uid) {
  return await api.delete(`users/${uid}/`);
}
