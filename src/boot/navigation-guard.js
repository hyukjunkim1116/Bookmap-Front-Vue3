// 'pinia'에서 제공하는 storeToRefs 함수를 import하여 Pinia 스토어의 상태를 refs로 변환합니다.
import { storeToRefs } from 'pinia';
// 'quasar/wrappers'에서 제공하는 boot 함수를 import하여 Quasar 앱의 초기화 작업을 수행합니다.
import { boot } from 'quasar/wrappers';
// 사용자 인증 정보를 관리하는 Pinia 스토어를 import합니다.
import { useAuthStore } from 'src/stores/auth';

// 페이지 접근 권한을 확인하는 함수
function requiresAuth(to) {
  // 사용자 인증 스토어에서 isAuthenticated 속성을 refs로 가져옵니다.
  const { isAuthenticated } = storeToRefs(useAuthStore());

  // 만약 해당 라우트가 인증이 필요한 메타 정보를 가지고 있고, 사용자가 인증되어 있지 않다면
  if (
    to.matched.some(record => record.meta.requiresAuth) &&
    !isAuthenticated.value
  ) {
    // 경고 메시지를 띄우고 홈 페이지로 리다이렉션합니다.
    alert('로그인이 필요한 페이지입니다.');
    return '/';
  }

  // 인증이 필요한 조건에 부합하거나 해당 라우트가 인증이 필요하지 않은 경우 허용합니다.
  return true;
}

// Quasar 앱 초기화 함수
export default boot(async ({ app, router }) => {
  // 라우터의 각 라우트 이전에 requiresAuth 함수를 실행하여 페이지 접근 권한을 확인합니다.
  router.beforeEach(requiresAuth);
});
