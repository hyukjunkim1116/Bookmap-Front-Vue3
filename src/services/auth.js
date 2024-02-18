import { api, formApi, jwtApi } from 'src/boot/axios-config';
import { useJwt } from '@vueuse/integrations/useJwt';
import { useAuthStore } from 'src/stores/auth';
import { useCookies } from 'vue3-cookies';

const DEFAULT_PHOTO_URL =
  'https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=';
export function generateDefaultPhotoURL(uid) {
  return `${DEFAULT_PHOTO_URL}${uid}`;
}
export async function sendVerificationEmail(uid) {
  return await jwtApi.post(`users/${uid}/verify/`);
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
  const response = await api.post(`users/kakao/`, data);
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

export async function logout() {
  const { cookies } = useCookies();
  cookies.remove('access');
  cookies.remove('refresh');
  localStorage.removeItem('auth/user');
  return;
}
export async function findPasswordWithEmail(data) {
  return await jwtApi.put(`users/find-password/`, data);
}
export async function updateUserPassword(data) {
  return await jwtApi.put(`users/change-password/`, data);
}
export async function updateUserProfile(data, uid) {
  return await jwtApi.put(`users/${uid}/`, data);
}
export async function updateUserImage(data, uid) {
  return await formApi.patch(`users/${uid}/image`, data);
}
export async function deleteUser(uid) {
  return await jwtApi.delete(`users/${uid}/`);
}
