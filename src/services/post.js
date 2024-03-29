import { jwtApi,api } from 'src/boot/axios-config';

export async function getPosts(params) {
  let url = `posts?`;
  if (params.page) {
    url += `page=${params.page}&`;
  }
  if (params.sort) {
    url += `sort=${params.sort}&`;
  }
  if (params.search) {
    url += `search=${params.search}`;
  }
  return await jwtApi.get(url);
}
export async function createPost(data) {
  return await jwtApi.post('posts', data);
}
export async function getPostDetails(postId) {
  return await jwtApi.get(`posts/${postId}`);
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
