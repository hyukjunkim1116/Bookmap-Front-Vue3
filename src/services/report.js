import { jwtApi } from 'src/boot/axios-config';
import { useCookies } from 'vue3-cookies';
export async function reportPost(postId, data) {
  return await jwtApi.post(`reports/${postId}`, data);
}
