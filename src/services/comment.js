import { api } from 'src/boot/2_axios-config';
export async function getComments(postId) {
  return await api.get(`posts/${postId}/comment`);
}
export async function addComment(postId, data) {
  return await api.post(`posts/${postId}/comment`, data);
}
export async function editComment(commentId, data) {
  return await api.put(`posts/comment/${commentId}`, data);
}
export async function deleteComment(commentId) {
  console.log(commentId, 'commentId');
  return await api.delete(`posts/comment/${commentId}`);
}
