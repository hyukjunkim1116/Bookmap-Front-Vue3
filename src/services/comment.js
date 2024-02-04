import { api } from 'src/boot/2_axios-config';
export async function getComments(postId) {
  return await api.get(`posts/${postId}/comment`);
}
export async function addComment(postId, data) {
  return await api.post(`posts/${postId}/comment`, data);
}
export async function editComment(commentId, data) {
  const requestData = { comment: data };
  return await api.put(`posts/comment/${commentId}`, requestData);
}
export async function deleteComment(commentId) {
  return await api.delete(`posts/comment/${commentId}`);
}
