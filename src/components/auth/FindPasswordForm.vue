<template>
  <div v-if="!isFind">
    <div class="text-h5 text-center text-weight-bold q-mb-xl">
      비밀번호 찾기
    </div>
    <q-form class="q-gutter-y-md" @submit.prevent="handleSubmit">
      <q-input v-model="email" placeholder="가입한 이메일" outlined dense />
      <q-btn
        type="submit"
        label="비밀번호 재설정"
        class="full-width"
        unelevated
        color="primary"
      />
      <q-separator />
      <q-btn
        label="로그인 하기"
        class="full-width"
        unelevated
        flat
        @click="$emit('changeView', 'SignInForm')"
      />
    </q-form>
  </div>
  <SuccessFindPassword
    v-else
    :newRandomPassword="newPassword"
    @changeView="handleChangeView"
  />
</template>
<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useAsyncState } from '@vueuse/core';
import { findPasswordWithEmail } from 'src/services';
import { getErrorMessage } from 'src/utils/error-message';
import SuccessFindPassword from './SuccessFindPassword.vue';
const newPassword = ref('');
const emit = defineEmits(['changeView']);
const $q = useQuasar();
const email = ref('');
const isFind = ref(false);
const { isLoading, execute } = useAsyncState(
  async () => await findPasswordWithEmail(email.value),
  null,
  {
    immediate: false,
    throwError: true,
    onSuccess: async response => {
      $q.notify('비밀번호를 확인하세요!');
      newPassword.value = response.data.password;
      isFind.value = true;
    },
    onError: err => {
      $q.notify({
        type: 'negative',
        message: getErrorMessage(err.response.data),
      });
    },
  },
);
const handleSubmit = () => execute(email.value);
const handleChangeView = view => {
  console.log('Event received from ChildComponent:', view);
  emit('changeView', view);
};
</script>

<style lang="scss" scoped></style>
