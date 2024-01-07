import { api } from 'src/boot/axios';
const DEFAULT_PHOTO_URL =
  'https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=';

export function generateDefaultPhotoURL(uid) {
  return `${DEFAULT_PHOTO_URL}${uid}`;
}

export async function logout(data) {
  return await api.post('logout/', data);
}

export async function signUpWithEmail(data) {
  return await api.post('signup/', data);
}

export async function signInWithEmail(data) {
  return await api.post('login/', data);
}
