import { api } from 'src/boot/axios';

// 기본 프로필 이미지 URL
const DEFAULT_PHOTO_URL =
  'https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=';

/**
 * 사용자 식별자를 기반으로 기본 프로필 사진 URL 생성
 * @param {string} uid - 사용자 고유 식별자
 * @returns {string} - 생성된 프로필 사진 URL
 */
export function generateDefaultPhotoURL(uid) {
  return `${DEFAULT_PHOTO_URL}${uid}`;
}

/**
 * 로그아웃 요청을 서버에 전송
 * @param {Object} data - 로그아웃 요청에 필요한 데이터
 * @returns {Promise} - 서버 응답
 */
export async function logout(data) {
  return await api.post('logout/', data);
}

/**
 * 이메일을 통한 회원가입 요청을 서버에 전송
 * @param {Object} data - 회원가입 요청에 필요한 데이터
 * @returns {Promise} - 서버 응답
 */
export async function signUpWithEmail(data) {
  return await api.post('signup/', data);
}

/**
 * 이메일을 통한 로그인 요청을 서버에 전송
 * @param {Object} data - 로그인 요청에 필요한 데이터
 * @returns {Promise} - 서버 응답
 */
export async function signInWithEmail(data) {
  return await api.post('login/', data);
}
