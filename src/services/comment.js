import { api, jwtApi } from 'src/boot/axios-config';

export async function getComments(postId, page) {
  return await api.get(`posts/${postId}/comment?page=${page}`);
}
export async function addComment(postId, data) {
  return await jwtApi.post(`posts/${postId}/comment`, data);
}
export async function editComment(commentId, data) {
  const requestData = { comment: data };
  return await jwtApi.put(`posts/comment/${commentId}`, requestData);
}
export async function deleteComment(commentId) {
  return await jwtApi.delete(`posts/comment/${commentId}`);
}
