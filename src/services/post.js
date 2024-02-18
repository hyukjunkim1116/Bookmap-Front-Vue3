import { api, jwtApi } from 'src/boot/axios-config';
import { useCookies } from 'vue3-cookies';

export async function getPosts(params) {
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
  return await jwtApi.post('posts/', data);
}
export async function getPostDetails(postId) {
  return await api.get(`posts/${postId}`);
}
export async function updatePost(postId, data) {
  return await jwtApi.put(`posts/${postId}`, data);
}
export async function deletePost(postId) {
  return await jwtApi.delete(`posts/${postId}`);
}

export async function handleLike(postId) {
  return await jwtApi.post(`posts/${postId}/like`);
}
export async function handleDislike(postId) {
  return await jwtApi.post(`posts/${postId}/dislike`);
}
export async function handleBookmark(postId) {
  return await jwtApi.post(`posts/${postId}/bookmark`);
}
