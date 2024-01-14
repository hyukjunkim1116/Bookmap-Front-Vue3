import { boot } from 'quasar/wrappers';
import axios from 'axios';
import { LocalStorage, Dark } from 'quasar';

// axios 인스턴스를 생성하고, 기본 URL을 로컬 서버의 API 엔드포인트로 설정
const api = axios.create({ baseURL: 'http://localhost:8080/api' });

export default boot(({ app }) => {
  const darkMode = LocalStorage.getItem('darkMode');
  Dark.set(darkMode);
  console.log(darkMode);

  // 전역 axios 인스턴스를 설정하여, 앱의 모든 곳에서 사용 가능하게 함
  app.config.globalProperties.$axios = api;
});
export { api };
