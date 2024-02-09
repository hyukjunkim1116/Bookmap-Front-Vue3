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
    console.log(response, 'res');
    authStore.setAuthentication(true);
    authStore.setUserToken(response.access, response.refresh);
    $q.notify('환영합니다 :)');
    $q.loading.hide();
    router.push('/');
  },
  onError: err => {
    console.log(err);
    $q.notify({
      type: 'negative',
      message: getErrorMessage(err.response.data),
    });
  },
});
onMounted(() => {
  $q.loading.show();
  console.log(route.query);
  console.log(route.query.code);
  const kakaoCode = route.query.code;
  execute(signInWithKakao, kakaoCode);
});
</script>

<style lang="scss" scoped></style>
