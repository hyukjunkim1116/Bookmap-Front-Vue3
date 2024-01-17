import { boot } from 'quasar/wrappers';
import axios from 'axios';

const isServerRunning = async () => {
  try {
    await djangoApi.get('/health-check');
    console.log('Django 서버 설정. 서버 응답:', response.data);
    return 8000;
  } catch (error) {
    console.error(
      'Django 서버가 응답하지 않으므로 스프링 서버로 연결됩니다. 서버 응답:',
      error.response.data,
    );
    return 8080;
  }
};
const port = async () => await isServerRunning();

// axios 인스턴스를 생성하고, 기본 URL을 로컬 서버의 API 엔드포인트로 설정
const api = axios.create({
  baseURL: `http://localhost:${port}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default boot(({ app }) => {
  // 전역 axios 인스턴스를 설정하여, 앱의 모든 곳에서 사용 가능하게 함
  app.config.globalProperties.$axios = api;
});

export { api };
