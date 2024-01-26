<template>
  <div class="q-gutter-y-md">
    <BaseCard>
      <q-form @submit.prevent="handleSubmitProfile">
        <q-card-section class="q-gutter-y-md">
          <div class="text-h6">프로필 변경</div>
          <q-input v-model="displayName" outlined dense label="닉네임" />
          <q-input v-model="email" outlined dense label="이메일" />
        </q-card-section>
        <q-separator />
        <q-card-actions>
          <q-space />
          <q-btn
            type="submit"
            label="저장하기"
            flat
            color="primary"
            :loading="isLoadingProfile"
          />
        </q-card-actions>
      </q-form>
    </BaseCard>
    <BaseCard>
      <q-form @submit.prevent="handleDeleteUser">
        <q-card-section class="q-gutter-y-md">
          <div class="text-h6">회원 탈퇴 하기</div>
        </q-card-section>
        <q-card-actions>
          <q-btn type="submit" label="삭제하기" flat color="primary" />
        </q-card-actions>
      </q-form>
    </BaseCard>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { useQuasar } from 'quasar';
import { useAsyncState } from '@vueuse/core';
import { updateUserProfile, deleteUser, logout } from 'src/services';
import { useAuthStore } from 'src/stores/auth';
import BaseCard from 'src/components/base/BaseCard.vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const authStore = useAuthStore();
const $q = useQuasar();
const displayName = ref('');
const email = ref('');
const uid = authStore.user?.payload.uid || null;
const { isLoading: isLoadingProfile, execute: executeProfile } = useAsyncState(
  async () => {
    const response = await updateUserProfile(
      { username: displayName.value, email: email.value },
      uid,
    );
    return response;
  },
  null,
  {
    immediate: false,
    onSuccess: () => {
      $q.notify('프로필 수정 완료!');
      authStore.setUserData({
        username: displayName.value,
        email: email.value,
        uid: authStore.getUserData.uid,
      });
    },
    onError: err => {
      console.log(err);
      console.log(err.message);
      $q.notify({
        type: 'negative',
        message: `${err.message}`,
      });
    },
  },
);
const { execute: executeDeleteUser } = useAsyncState(
  async () => {
    const response = await deleteUser(uid);
    return response;
  },
  null,
  {
    immediate: false,
    onSuccess: async () => {
      await logout();
      // router.push('/');
      window.location.replace('/');
      $q.notify('삭제 완료!');
    },
    onError: response => {
      console.log(response);
      console.log(response.err);
      $q.notify({
        type: 'negative',
        message: `${response.err}`,
      });
    },
  },
);
const handleDeleteUser = async () => {
  if (confirm('수정 하시겠어요?') === false) {
    return;
  }
  await executeDeleteUser(uid);
};
const handleSubmitProfile = () =>
  executeProfile({ username: displayName.value, email: email.value }, uid);
watchEffect(() => {
  displayName.value = authStore.user?.payload.username;
  email.value = authStore.user?.payload.email;
});
</script>

<style lang="scss" scoped></style>
