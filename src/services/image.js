import { v4 as uuidv4 } from 'uuid';
import { api } from 'src/boot/2_axios-config';
import { useCookies } from 'vue3-cookies';
import { readAndCompressImage } from 'browser-image-resizer';

export async function uploadPostImage(data) {
  const { cookies } = useCookies();
  api.interceptors.request.use(async config => {
    if (!config.headers) return config;
    const accessToken = cookies.get('access');
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      config.headers['Content-Type'] = 'multipart/form-data';
    }
    return config;
  });
  // api.interceptors.request.use(config => {

  //   return config;
  // });
  console.log(data, 'image');
  return await api.post(`posts/image`, data);
}
export async function deletePostImage(url) {
  const { cookies } = useCookies();
  api.interceptors.request.use(async config => {
    if (!config.headers) return config;
    const accessToken = cookies.get('access');
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      // config.headers['Content-Type'] = 'multipart/form-data';
    }
    return config;
  });
  // api.interceptors.request.use(config => {

  //   return config;
  // });
  console.log(url, 'image');
  return await api.delete(`posts/image?url=${url}`);
}
export async function compressImage(file) {
  return readAndCompressImage(file, {
    quality: 0.8,
  });
}
