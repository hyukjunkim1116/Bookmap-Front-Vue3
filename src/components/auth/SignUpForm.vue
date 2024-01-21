<template>
  <!-- 회원가입 폼의 메인 컨테이너 -->
  <div>
    <!-- 회원가입 폼의 제목 -->
    <div class="text-h5 text-center text-weight-bold q-mb-xl">회원가입</div>

    <!-- 회원가입 폼 -->
    <q-form class="q-gutter-y-md" @submit.prevent="handleSubmit">
      <!-- 이메일 입력 필드 -->
      <q-input
        v-model="form.email"
        placeholder="이메일"
        outlined
        dense
        hide-bottom-space
      />
      <q-input
        v-model="form.username"
        placeholder="닉네임"
        outlined
        dense
        hide-bottom-space
      />
      <!-- 비밀번호 입력 필드 -->
      <q-input
        v-model="form.password"
        type="password"
        placeholder="비밀번호(문자, 숫자조합 8자 이상)"
        outlined
        dense
        hide-bottom-space
      />
      <!-- 비밀번호 확인 입력 필드 -->
      <q-input
        v-model="passwordConfirm"
        type="password"
        placeholder="비밀번호 확인"
        outlined
        dense
        hide-bottom-space
      />

      <!-- 제출 버튼 -->
      <q-btn
        type="submit"
        label="가입하기"
        class="full-width"
        unelevated
        color="primary"
        :loading="isLoading"
      />

      <!-- 구분선 -->
      <q-separator />
      <!-- 로그인 화면으로 전환하는 버튼 -->
      <q-btn
        label="로그인 하기"
        class="full-width"
        unelevated
        flat
        @click="$emit('changeView', 'SignInForm')"
      />
    </q-form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useAsyncState } from '@vueuse/core';
import { signUpWithEmail } from 'src/services';
const emit = defineEmits(['changeView', 'closeDialog']);

const $q = useQuasar();
/**
 * 이메일을 통한 회원가입 요청을 서버에 전송
 * @param {Object} data - 회원가입 요청에 필요한 데이터
 * @returns {Promise} - 서버 응답
 */
const { isLoading, execute } = useAsyncState(
  async () => {
    // signUpWithEmail 함수에 form 데이터를 전달
    await signUpWithEmail(form.value);
  },
  null,
  {
    immediate: false,
    onSuccess: () => {
      // 회원가입 성공 시 알림
      $q.notify('가입을 환영합니다 :)');
      emit('changeView', 'SignInForm');
    },
    // onError 주석은 오류 처리 관련 주석입니다.
    onError: err => {
      console.log(err);
      $q.notify({
        type: 'negative',
        message: `${err.response.data.error}`,
      });
    },
  },
);

// 비밀번호 확인을 위한 ref
const passwordConfirm = ref('');
// 폼 데이터 모델
const form = ref({
  email: '',
  password: '',
  username: '',
  passwordConfirm: passwordConfirm,
});
// 폼 제출 처리 함수
const handleSubmit = () => execute(form.value);
</script>

<style lang="scss" scoped></style>
