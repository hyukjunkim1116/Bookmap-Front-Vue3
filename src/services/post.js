import { getUserById } from './user';
export async function createPost(data) {
  return await api.post('api/post/', {
    title: data.title,
    content: data.content,
  });
}
export async function getPosts() {
  return await api.post('api/post/');
}
export async function getPost(postId, data) {
  return await api.post(`api/post/${postId}`, {
    title: data.title,
    content: data.content,
  });
}
export async function updatePost(uid, postId, data) {
  return await api.post(`api/${uid}_${postId}`, {
    title: data.title,
    content: data.content,
  });
}

export async function deletePost(uid, postId, data) {
  return await api.post(`api/${uid}_${postId}`);
}
