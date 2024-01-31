<template>
  <BaseCard>
    <q-form @submit.prevent="handleSubmit">
      <q-card-section class="q-gutter-y-md">
        <div class="text-h6">비밀번호 변경</div>
        <q-input
          v-model="form.oldPassword"
          type="password"
          outlined
          dense
          label="현재 비밀번호"
          :rules="[validateRequired]"
        />
        <q-input
          v-model="form.newPassword"
          type="password"
          outlined
          dense
          label="새로운 비밀번호"
          :rules="[validateRequired, validatePassword]"
        />
        <q-input
          v-model="form.newPasswordConfirm"
          type="password"
          outlined
          dense
          label="새로운 비밀번호 확인"
          :rules="[
            validateRequired,
            val => validatePasswordConfirm(form.newPassword, val),
          ]"
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
          :loading="isLoading"
        />
      </q-card-actions>
    </q-form>
  </BaseCard>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { useAsyncState } from '@vueuse/core';
import BaseCard from 'src/components/base/BaseCard.vue';
import { logout, updateUserPassword } from 'src/services';
import { ref } from 'vue';
import {
  validateRequired,
  validatePassword,
  validatePasswordConfirm,
} from 'src/utils/validate-rules';
import { getErrorMessage } from 'src/utils/error-message';
import { useAuthStore } from 'src/stores/auth';
const authStore = useAuthStore();
const $q = useQuasar();
const newPasswordConfirm = ref('');
const emit = defineEmits(['changeView']);
const form = ref({
  oldPassword: '',
  newPassword: '',
  newPasswordConfirm: newPasswordConfirm,
});
const { isLoading, execute } = useAsyncState(
  async () => await updateUserPassword(form.value),
  null,
  {
    immediate: false,
    throwError: true,
    onSuccess: () => {
      $q.dialog({
        title: '알림',
        message: '비밀번호가 변경되었습니다. 다시 로그인 하세요',
        persistent: true,
        ok: {
          push: true,
        },
      }).onOk(async () => {
        await logout();
        authStore.setAuthentication(false);
        router.push('/');
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
const handleSubmit = () => execute(form.value);
</script>
<style lang="scss" scoped></style>
