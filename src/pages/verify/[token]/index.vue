<template>
  <div></div>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth';
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const verify = async () => {
  authStore.setUserData({
    email: authStore.loginUser.email,
    username: authStore.loginUser.username,
    uid: authStore.loginUser.uid,
    image: authStore.loginUser.image,
    social: authStore.loginUser.social,
    emailVerified: true,
  });
  console.log(route.params.token);
};
onMounted(async () => {
  $q.loading.show();
  console.log('sdadas');
  await verify();
  $q.loading.hide();
  $q.notify('인증이 완료 되었습니다!');
  router.push('/');
});
</script>

<style lang="scss" scoped></style>
