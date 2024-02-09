<template>
  <div class="q-gutter-y-md">
    <BaseCard>
      <q-form @submit.prevent="handleSubmitProfile">
        <q-card-section class="q-gutter-y-md">
          <div class="text-h6">프로필 변경</div>
          <q-input v-model="displayName" outlined dense label="닉네임" />
          <q-input
            v-model="email"
            outlined
            dense
            label="이메일"
            v-bind:disable="is_social"
          />
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
        <div class="text-h6 center">이미지 업로드</div>
        <q-uploader
          ref="uploader"
          style="max-width: 300px"
          v-model="image"
          max-files="1"
          accept=".jpg, .png, .jpeg"
          @rejected="onRejected"
          :factory="uploadFactory"
          @added="onImageAdded"
        />
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
import { compressImage } from 'src/services';
import { getErrorMessage } from 'src/utils/error-message';
import BaseCard from 'src/components/base/BaseCard.vue';
const authStore = useAuthStore();
const $q = useQuasar();
const displayName = ref('');
const email = ref('');
const image = ref(null);
const uploader = ref(null);
const uid = authStore.loginUser?.uid || null;
const is_social = authStore.loginUser?.social;

const { isLoading: isLoadingProfile, execute: executeProfile } = useAsyncState(
  updateUserProfile,
  null,
  {
    immediate: false,
    onSuccess: () => {
      $q.notify('프로필 수정 완료!');
      authStore.setUserData({
        username: displayName.value,
        email: email.value,
        uid: uid,
        image: authStore.loginUser.image,
        social: authStore.loginUser.social,
      });
    },
    onError: err => {
      console.log(err);
      $q.notify({
        type: 'negative',
        message: getErrorMessage(err.response.data),
      });
    },
  },
);
const { execute: executeDeleteUser } = useAsyncState(deleteUser, null, {
  immediate: false,
  onSuccess: async () => {
    await logout();
    window.location.replace('/');
    $q.notify('삭제 완료!');
  },
  onError: err => {
    $q.notify({
      type: 'negative',
      message: getErrorMessage(err.response.data),
    });
  },
});
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
    await executeDeleteUser(deleteUser, uid);
  });
};
const handleSubmitProfile = () => {
  const data = { username: displayName.value, email: email.value };
  executeProfile(updateUserProfile, data, uid);
};

const { execute: executeUploadImage } = useAsyncState(updateUserImage, null, {
  immediate: false,
  onSuccess: response => {
    $q.notify('사진 업로드 완료!');
    authStore.setUserData({
      username: authStore.loginUser.username,
      email: authStore.loginUser.email,
      uid: uid,
      image: response.data.image,
      social: authStore.loginUser.social,
    });

    image.value = null;
    uploader.value.reset();
  },
  onError: err => {
    $q.notify({
      type: 'negative',
      message: getErrorMessage(err.response.data),
    });
    image.value = null;
    uploader.value.reset();
  },
});

const onRejected = () => {
  $q.notify({
    type: 'negative',
    message: '.jpg, .png, .jpeg 파일만 업로드 가능합니다!',
  });
};
const onImageAdded = newImage => {
  image.value = newImage[0];
};
const uploadFactory = async () => {
  const data = await compressImage(image.value);
  const formData = new FormData();
  formData.append('image', data);
  console.log(formData);
  executeUploadImage(updateUserImage, formData, uid);
};
watchEffect(() => {
  displayName.value = authStore.loginUser?.username;
  email.value = authStore.loginUser?.email;
});
</script>

<style lang="scss" scoped></style>
