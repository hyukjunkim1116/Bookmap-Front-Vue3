<template>
  <div></div>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { onMounted } from 'vue';
import {useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth';
const authStore = useAuthStore();
const router = useRouter();
const $q = useQuasar();
const verify = async () => {
  authStore.setUserData({
    emailVerified: true,
  });

};
onMounted(async () => {
  $q.loading.show();

  await verify();
  $q.loading.hide();
  $q.notify('인증이 완료 되었습니다!');
  router.push('/');
});
</script>

<style lang="scss" scoped></style>
