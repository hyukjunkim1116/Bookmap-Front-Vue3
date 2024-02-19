import { jwtApi } from 'src/boot/axios-config';
export async function reportPost(postId, data) {
  return await jwtApi.post(`reports/${postId}`, data);
}
