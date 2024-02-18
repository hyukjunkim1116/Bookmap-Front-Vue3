import { formApi, jwtApi } from 'src/boot/axios-config';
import { readAndCompressImage } from 'browser-image-resizer';

export async function uploadPostImage(data) {
  return await formApi.post(`posts/image`, data);
}
export async function deletePostImage(url) {
  return await jwtApi.delete(`posts/image?url=${url}`);
}
export async function compressImage(file) {
  return readAndCompressImage(file, {
    quality: 0.8,
  });
}
