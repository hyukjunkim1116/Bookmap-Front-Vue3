import { boot } from 'quasar/wrappers';
import axios from 'axios';
const djangoApi = 'http://127.0.0.1:8000';
const springApi = 'http://localhost:8080';
const isServerRunning = async () => {
  try {
    const response = await axios.get(`${djangoApi}/health-check`);
    if (response.status === 200) {
      console.log('Django 서버 설정. 서버 응답:', response.data);
      const api = axios.create({
        baseURL: `http://${djangoApi}/api/`,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return api;
    }
  } catch (error) {
    console.error(
      'Django 서버가 응답하지 않으므로 스프링 서버로 연결됩니다. 서버 응답:',
      error.response ? error.response.data : error.message,
    );
    const api = axios.create({
      baseURL: `http://${springApi}/api/`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return api;
  }
};

// axios 인스턴스를 생성하고, 기본 URL을 로컬 서버의 API 엔드포인트로 설정
const api = async () => await isServerRunning();
export default boot(async ({ app }) => {
  // 전역 axios 인스턴스를 설정하여, 앱의 모든 곳에서 사용 가능하게 함
  app.config.globalProperties.$api = api;
  console.log(api);
});

export { api };
