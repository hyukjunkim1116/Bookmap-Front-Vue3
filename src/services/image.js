import { v4 as uuidv4 } from 'uuid';
import { api } from 'src/boot/2_axios-config';
import { readAndCompressImage } from 'browser-image-resizer';

export async function uploadPostImage(data) {
  api.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'multipart/form-data';
    return config;
  });
  console.log(data, 'image');
  return await api.post(`posts/image`, data);
}

export async function compressImage(file) {
  return readAndCompressImage(file, {
    quality: 0.8,
  });
}
