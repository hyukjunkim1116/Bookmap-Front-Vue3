import { boot } from 'quasar/wrappers';
import axios from 'axios';

// axios 인스턴스를 생성하고, 기본 URL을 로컬 서버의 API 엔드포인트로 설정
const api = axios.create({ baseURL: 'http://localhost:8080/api' });

/**
 * Quasar 앱 부트 파일.
 * 이 함수는 앱의 시작 시 실행되며, 여기서는 axios 인스턴스를 전역으로 설정함.
 * @param {Object} param - Quasar 앱 인스턴스와 관련 정보
 */
export default boot(({ app }) => {
  // 전역 axios 인스턴스를 설정하여, 앱의 모든 곳에서 사용 가능하게 함
  app.config.globalProperties.$axios = api;
  console.log(api);
});

// axios 인스턴스를 내보내어 다른 곳에서도 사용할 수 있게 함
export { api };
