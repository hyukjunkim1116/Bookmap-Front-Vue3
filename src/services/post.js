import { api } from 'src/boot/2_axios-config';
export async function getPosts(params) {
  console.log(params);
  let url = `posts/?`;
  if (params.page) {
    url += `page=${params.page}&`;
  }
  if (params.sort) {
    url += `sort=${params.sort}&`;
  }
  if (params.search) {
    url += `search=${params.search}`;
  }
  return await api.get(url);
}
export async function createPost(data) {
  return await api.post('posts/', data);
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
