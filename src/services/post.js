import { api } from 'src/boot/2_axios-config';
export async function getPosts(params) {
  return await api.get(`posts/?sort=${params.sort}&search=${params.search}`);
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

export async function handleLike(postId) {
  return await api.post(`posts/${postId}/like`);
}
export async function handleDislike(postId) {
  return await api.post(`posts/${postId}/dislike`);
}
export async function handleBookmark(postId) {
  return await api.post(`posts/${postId}/bookmark`);
}
