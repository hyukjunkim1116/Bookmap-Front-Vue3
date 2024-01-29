import { api } from 'src/boot/2_axios-config';
export async function getPosts() {
  return await api.get('posts/');
}
export async function createPost(data) {
  const response = await api.post('posts/', data);
  return response;
}
export async function getPostDetails(postId) {
  return await api.get(`posts/${postId}`);
}
export async function updatePost(postId, data) {
  return await api.put(`posts/${postId}`, data);
}
export async function deletePost(postId) {
  return await api.delete(`posts/${postId}`);
}
