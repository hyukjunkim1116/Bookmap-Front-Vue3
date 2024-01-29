import { api } from 'src/boot/2_axios-config';
import { useJwt } from '@vueuse/integrations/useJwt';
import { useAuthStore } from 'src/stores/auth';
import { Cookies } from 'quasar';

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
  const access = response.data.access;
  const refresh = response.data.refresh;
  const email = response.data.email;
  const username = response.data.username;
  authStore.setUserToken(access, refresh);
  const { payload } = useJwt(access);
  authStore.setUserData({
    email,
    username,
    uid: payload.value.user_id,
  });
  return response.data;
}

export async function logout() {
  Cookies.remove('access');
  Cookies.remove('refresh');
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
export async function deleteUser(uid) {
  return await api.delete(`users/${uid}/`);
}
