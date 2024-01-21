import { api } from 'boot/init';
export async function getPosts() {
  return await api.get('post/');
}
export async function getPost() {
  return await api.post('post/');
}
export async function createPost(data) {
  return await api.post('post/', data);
}
export async function updatePost(postId, data) {
  return await api.post(`post/${postId}`, data);
}
export async function deletePost(postId) {
  return await api.post(`post/${postId}`);
}
