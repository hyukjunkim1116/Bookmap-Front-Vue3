<template>
  <div></div>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { onMounted } from 'vue';
import { getErrorMessage } from 'src/utils/error-message';
import { useAsyncState } from '@vueuse/core';
import { signInWithKakao } from 'src/services';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth';
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const $q = useQuasar();
const { isLoading, error, execute } = useAsyncState(signInWithKakao, null, {
  immediate: false,
  throwError: true,
  onSuccess: response => {
    router.push('/');
    authStore.setAuthentication(true);
    authStore.setUserToken(response.access, response.refresh);
    $q.notify('환영합니다 :)');
    $q.loading.hide();
  },
  onError: err => {
    console.log(err);

    // $q.notify({
    //   type: 'negative',
    //   message: 'Something went Wrong(요청 두번 보냄)',
    // });
    $q.loading.hide();
    router.push('/');
  },
});
onMounted(async () => {
  $q.loading.show();
  const kakaoCode = route.query.code;
  console.log(kakaoCode, 'kakaocode');
  await execute(signInWithKakao, kakaoCode);
  router.push('/');
});
</script>

<style lang="scss" scoped></style>
