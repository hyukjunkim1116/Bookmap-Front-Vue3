// src/boot/axios.js
import { boot } from 'quasar/wrappers';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8080/api' });

export default boot(({ app }) => {
  // `app.config.globalProperties`를 사용하여 Vue 인스턴스에 `$axios`를 추가합니다.
  app.config.globalProperties.$axios = api;

  // 옵션: Vuex 스토어에도 추가할 수 있습니다.
  // store.$axios = api;
});

// Axios 인스턴스를 내보내어 필요할 때 임포트해서 사용할 수 있습니다.
export { api };
