import { api } from 'src/boot/1_init';
import { useJwt } from '@vueuse/integrations/useJwt';
import { useAuthStore } from 'src/stores/auth';
import { Cookies } from 'quasar';
// 기본 프로필 이미지 URL
const DEFAULT_PHOTO_URL =
  'https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=';
export async function signUpWithEmail(data) {
  return await api.post('users/', data);
}

/**
 * 이메일을 통한 로그인 요청을 서버에 전송
 * @param {Object} data - 로그인 요청에 필요한 데이터
 * @returns {Promise} - 서버 응답
 */
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
  // loginStore.setAuthentication(true);
  return response.data;
}


export function logout() {
  Cookies.remove('access');
  Cookies.remove('refresh');
  localStorage.removeItem('auth/user');
}

/**
 * 사용자 식별자를 기반으로 기본 프로필 사진 URL 생성
 * @param {string} uid - 사용자 고유 식별자
 * @returns {string} - 생성된 프로필 사진 URL
 */
export function generateDefaultPhotoURL(uid) {
  return `${DEFAULT_PHOTO_URL}${uid}`;
}
