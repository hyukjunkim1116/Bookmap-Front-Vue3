<template>
  <!-- 로그인 폼의 메인 컨테이너 -->
  <div>
    <!-- 로그인 폼의 제목 -->
    <div class="text-h5 text-center text-weight-bold q-mb-xl">로그인</div>

    <!-- 로그인 폼 -->
    <q-form class="q-gutter-y-md" @submit.prevent="handleSignInEmail">
      <!-- 이메일 입력 필드 -->
      <q-input v-model="form.email" placeholder="이메일" outlined dense />
      <!-- 비밀번호 입력 필드 -->
      <q-input
        v-model="form.password"
        type="password"
        placeholder="비밀번호"
        outlined
        dense
      />
      <div>
        <!-- 로그인 버튼 -->
        <q-btn
          type="submit"
          label="로그인하기"
          class="full-width"
          unelevated
          color="primary"
          :loading="isLoading"
        />
        <div class="flex justify-between">
          <!-- 비밀번호 찾기 버튼 -->
          <q-btn
            label="비밀번호 찾기"
            color="secondary"
            flat
            dense
            size="13px"
            @click="$emit('changeView', 'FindPasswordForm')"
          />
          <!-- 회원가입 전환 버튼 -->
          <q-btn
            label="이메일 가입하기"
            color="secondary"
            flat
            dense
            size="13px"
            @click="$emit('changeView', 'SignUpForm')"
          />
        </div>
      </div>

      <!-- 구분선 -->
      <q-separator />
    </q-form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useAsyncState } from '@vueuse/core';
import { signInWithEmail } from 'src/services';
import { useLoginStore } from 'src/stores/isLogin';
const emit = defineEmits(['changeView', 'closeDialog']);
const $q = useQuasar();
const loginStore = useLoginStore();
// 로그인 비동기 처리와 상태 관리
const { isLoading, error, execute } = useAsyncState(
  async () => {
    // signUpWithEmail 함수에 form 데이터를 전달
    await signInWithEmail(form.value);
  },
  null,
  {
    immediate: false,
    throwError: true,
    onSuccess: () => {
      // 로그인 성공 시 알림
      loginStore.setAuthentication(true);
      $q.notify('환영합니다 :)');
      emit('closeDialog');
    },
    // onError 주석은 오류 처리 관련 주석입니다.
    onError: err => {
      $q.notify({
        type: 'negative',
        message: `${err.response?.data?.error}`,
      });
    },
  },
);

// 로그인 폼 데이터 모델
const form = ref({
  email: '',
  password: '',
  username: null,
  passwordConfirm: null,
});
// 로그인 처리 함수
const handleSignInEmail = () => execute(form.value);
</script>

<style lang="scss" scoped></style>
