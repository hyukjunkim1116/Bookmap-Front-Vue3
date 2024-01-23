import { api } from 'boot/init';
import { useAuthStore } from 'src/stores/auth';
import { Cookies } from 'quasar';
export async function getPosts() {
  return await api.get('posts/');
}
export async function createPost(data) {
  const authStore = useAuthStore();
  api.interceptors.request.use(config => {
    const token = Cookies.get('access', '123');
    console.log(token);
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
    return config;
  });

  try {
    const response = await api.post('posts/', data);
    return response.data;
  } catch (error) {
    console.error('에러 발생:', error);
    throw error;
  }
}
export async function getPostDetails(postId) {
  return await api.post(`posts/${postId}`);
}
export async function updatePost(postId, data) {
  return await api.put(`posts/${postId}`, data);
}
export async function deletePost(postId) {
  return await api.delete(`posts/${postId}`);
}
