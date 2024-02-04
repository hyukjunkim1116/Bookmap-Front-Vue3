import { api } from 'src/boot/2_axios-config';
export async function getPosts(params) {
  console.log(params, '123123');

  return await api.get(`posts/?sort=${params.sort}`);
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

async function incrementReadCount(id) {}
export async function addLike(uid, postId) {}

export async function removeLike(uid, postId) {}

export async function hasLike(uid, postId) {}

export async function addBookmark(uid, postId) {}

export async function removeBookmark(uid, postId) {}

export async function hasBookmark(uid, postId) {}

export async function getUserBookmarks(uid) {}
