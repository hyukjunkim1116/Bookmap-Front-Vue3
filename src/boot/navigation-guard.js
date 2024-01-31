import { storeToRefs } from 'pinia';
import { boot } from 'quasar/wrappers';
import { useAuthStore } from 'src/stores/auth';

function requiresAuth(to) {
  const authStore = storeToRefs(useAuthStore());

  if (
    to.matched.some(record => record.meta.requiresAuth) &&
    !authStore.isLogin.value
  ) {
    return '/';
  }
  return true;
}
export default boot(async ({ app, router }) => {
  router.beforeEach(requiresAuth);
});
