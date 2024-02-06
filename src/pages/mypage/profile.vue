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
      <q-card-section class="q-gutter-y-md">
        <div class="text-h6">이미지 업로드</div>
        <q-form @submit.prevent="handleSubmitImage" class="q-gutter-md">
          <q-file
            name="user_image"
            v-model="file"
            filled
            accept=".jpg, .png, .jpeg"
            label="이미지를 선택하세요"
            max-files="1"
            @rejected="onRejected"
          />
          <div>
            <q-btn label="업로드" type="submit" color="primary" />
          </div>
        </q-form>
      </q-card-section>
      <q-separator />
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
import {
  updateUserProfile,
  deleteUser,
  logout,
  updateUserImage,
} from 'src/services';
import { useAuthStore } from 'src/stores/auth';
import { getErrorMessage } from 'src/utils/error-message';
import BaseCard from 'src/components/base/BaseCard.vue';
const authStore = useAuthStore();
const $q = useQuasar();
const displayName = ref('');
const email = ref('');
const file = ref(null);

const uid = authStore.loginUser?.uid || null;
//TODO : Content-type : application/json인데 이거 바꿔야함
const { execute: executeUploadImage } = useAsyncState(updateUserImage, null, {
  immediate: false,
  onSuccess: () => {
    $q.notify('사진 업로드 완료!');
  },
  onError: err => {
    console.log(err);
    $q.notify({
      type: 'negative',
      message: getErrorMessage(err.response.data),
    });
  },
});
const { isLoading: isLoadingProfile, execute: executeProfile } = useAsyncState(
  async () =>
    await updateUserProfile(
      { username: displayName.value, email: email.value },
      uid,
    ),
  null,
  {
    immediate: false,
    onSuccess: () => {
      $q.notify('프로필 수정 완료!');
      authStore.setUserData({
        username: displayName.value,
        email: email.value,
        uid: uid,
      });
    },
    onError: err => {
      $q.notify({
        type: 'negative',
        message: getErrorMessage(err.response.data),
      });
    },
  },
);
const { execute: executeDeleteUser } = useAsyncState(
  async () => await deleteUser(uid),
  null,
  {
    immediate: false,
    onSuccess: async () => {
      await logout();
      // router.push('/');
      window.location.replace('/');
      $q.notify('삭제 완료!');
    },
    onError: err => {
      $q.notify({
        type: 'negative',
        message: getErrorMessage(err.response.data),
      });
    },
  },
);
const handleDeleteUser = async () => {
  $q.dialog({
    title: '알림',
    message: '삭제 하시겠어요?',
    persistent: true,
    cancel: true,
    ok: {
      push: true,
    },
    cancel: {
      push: true,
      color: 'negative',
    },
  }).onOk(async () => {
    await executeDeleteUser(uid);
  });
};
const handleSubmitProfile = () =>
  executeProfile({ username: displayName.value, email: email.value }, uid);
const onRejected = () => {
  $q.notify({
    type: 'negative',
    message: '`.jpg, .png, .jpeg` 파일만 업로드 가능합니다!',
  });
};
const handleSubmitImage = () => {
  executeUploadImage(updateUserImage, file.value, uid);
};
watchEffect(() => {
  displayName.value = authStore.loginUser?.username;
  email.value = authStore.loginUser?.email;
});
</script>

<style lang="scss" scoped></style>
