import { api, formApi, jwtApi } from 'src/boot/axios-config';
import { useJwt } from '@vueuse/integrations/useJwt';
import { useAuthStore } from 'src/stores/auth';
import { useCookies } from 'vue3-cookies';

const DEFAULT_PHOTO_URL =
  'https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=';
export function generateDefaultPhotoURL(uid) {
  return `${DEFAULT_PHOTO_URL}${uid}`;
}
export async function signUpWithEmail(data) {
  return await api.post('users/', data);
}
export async function signInWithKakao(data) {
  const authStore = useAuthStore();
  const response = await api.post(`users/kakao/`, data);

  const { access, refresh, email, username, image, social, is_verified } =
    response.data;
  authStore.setUserToken(access, refresh);
  const { user_id } = useJwt(access).payload.value;

  const userData = {
    uid: user_id,
    email,
    username,
    image: image || generateDefaultPhotoURL(user_id),
    social,
    emailVerified: is_verified,
  };
  authStore.setUserData(userData);
}
export async function signInWithEmail(data) {
  const authStore = useAuthStore();

  const response = await api.post('users/login/', data);

  const { access, refresh, email, username, image, social, is_verified } =
    response.data;

  authStore.setUserToken(access, refresh);
  const { user_id } = useJwt(access).payload.value;
  const userData = {
    uid: user_id,
    email,
    username,
    image: image || generateDefaultPhotoURL(user_id),
    social,
    emailVerified: is_verified,
  };
  authStore.setUserData(userData);
}
export async function updateUserPassword(data) {
  return await jwtApi.put(`users/change-password/`, data);
}
export async function sendVerificationEmail(uid) {
  return await jwtApi.post(`users/${uid}/verify/`);
}

export async function findPasswordWithEmail(data) {
  return await jwtApi.put(`users/find-password/`, data);
}
export async function updateUserProfile(data, uid) {
  return await jwtApi.put(`users/${uid}/`, data);
}
export async function deleteUser(uid) {
  return await jwtApi.delete(`users/${uid}/`);
}
export async function updateUserImage(data, uid) {
  return await formApi.patch(`users/${uid}/image`, data);
}
export async function logout() {
  const { cookies } = useCookies();
  cookies.remove('access');
  cookies.remove('refresh');
  localStorage.removeItem('auth/user');
  return;
}
