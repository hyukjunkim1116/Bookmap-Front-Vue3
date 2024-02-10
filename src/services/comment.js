import { api } from 'src/boot/2_axios-config';
import { useCookies } from 'vue3-cookies';
import { useAuthStore } from 'src/stores/auth';
import { logout } from 'src/services';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
const router = useRouter();
const $q = useQuasar();
const { cookies } = useCookies();
export async function getComments(postId, page) {
  return await api.get(`posts/${postId}/comment?page=${page}`);
}
export async function addComment(postId, data) {
  console.log(postId, data, 'zxczxc');
  api.interceptors.request.use(async config => {
    if (!config.headers) return config;
    const accessToken = cookies.get('access');
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });
  let refreshing = false;
  api.interceptors.response.use(
    response => response,
    async error => {
      if (error.config && error.response && error.response.status === 401) {
        if (!refreshing) {
          try {
            console.log('here');
            refreshing = true;
            const originalRequest = error.config;
            originalRequest._retry = true;
            const refreshToken = cookies.get('refresh');
            console.log(refreshToken, 'refreshtoken');
            if (!refreshToken) {
              throw new Error('Refresh token not found');
            }
            const response = await api.post('users/token/refresh/', {
              refresh: refreshToken,
            });
            console.log(response, 'response');
            const authStore = useAuthStore();
            const newAccessToken = response.data.access;
            authStore.setUserToken(newAccessToken, refreshToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return api(originalRequest);
          } catch {
            await logout();
            window.location.replace('/');
            alert('다시 로그인 하세요!!');
            return;
          }
        } else {
          console.log(error);
          console.log('aaaaaaa');
          await logout();
          window.location.replace('/');
          alert('다시 로그인 하세요!!');
          return;
        }
      } else {
        console.log(error);
        return;
      }
    },
  );
  return await api.post(`posts/${postId}/comment`, data);
}

// let refreshing = false;

//       if (!refreshing) {
//         try {
//           console.log('here');
//           refreshing = true;
//           const originalRequest = error.config;
//           originalRequest._retry = true;
//           const refreshToken = cookies.get('refresh');
//           console.log(refreshToken, 'refreshtoken');
//           if (!refreshToken) {
//             throw new Error('Refresh token not found');
//           }

//           const response = await api.post('users/token/refresh/', {
//             refresh: refreshToken,
//           });

//           const authStore = useAuthStore();
//           const newAccessToken = response.data.access;
//           authStore.setUserToken(newAccessToken, refreshToken);
//           originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//           console.log(response, 'response');
//           // Reset the refreshing flag before making the retry request
//           refreshing = false;
//           console.log(refreshing, '3434');
//           return api(originalRequest);
//         } catch (err) {
//           await logout();
//           window.location.replace('/');
//           alert('다시 로그인 하세요');
//         }
//       } else {
//         alert('관리자에게 문의하세요!');
//         await logout();
//         window.location.replace('/');
//       }
//     }
//     return Promise.reject(error);
//   },
// );
export async function editComment(commentId, data) {
  api.interceptors.request.use(async config => {
    if (!config.headers) return config;
    const accessToken = cookies.get('access');
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });
  const requestData = { comment: data };
  return await api.put(`posts/comment/${commentId}`, requestData);
}
export async function deleteComment(commentId) {
  api.interceptors.request.use(async config => {
    if (!config.headers) return config;
    const accessToken = cookies.get('access');
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });
  return await api.delete(`posts/comment/${commentId}`);
}
