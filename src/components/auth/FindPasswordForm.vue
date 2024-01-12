<template>
  <!-- 비밀번호 찾기 폼의 메인 컨테이너 -->
  <div>
    <!-- 비밀번호 찾기 폼의 제목 -->
    <div class="text-h5 text-center text-weight-bold q-mb-xl">
      비밀번호 찾기
    </div>

    <!-- 비밀번호 찾기 폼 -->
    <q-form class="q-gutter-y-md">
      <!-- 가입한 이메일을 입력받는 필드 -->
      <q-input placeholder="가입한 이메일" outlined dense />
      <!-- 확인 버튼 -->
      <q-btn label="확인" class="full-width" unelevated color="primary" />

      <!-- 구분선 -->
      <q-separator />
      <!-- 로그인 화면으로 돌아가는 버튼 -->
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
// 'changeView' 이벤트를 정의함으로써, 부모 컴포넌트에서 화면 변경을 처리할 수 있습니다.
defineEmits(['changeView']);
</script>

<style lang="scss" scoped></style>
