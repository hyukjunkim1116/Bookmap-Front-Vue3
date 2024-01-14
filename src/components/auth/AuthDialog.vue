<template>
  <!-- 다이얼로그 컴포넌트: 인증 관련 뷰(로그인, 회원가입, 비밀번호 찾기)를 표시 -->
  <q-dialog
    :model-value="modelValue"
    @update:model-value="val => $emit('update:modelValue', val)"
    transition-show="none"
    transition-hide="none"
    @hide="changeViewMode('SignInForm')"
  >
    <!-- 카드 스타일의 다이얼로그 -->
    <q-card :style="{ width: '400px' }">
      <!-- 닫기 버튼을 포함한 카드 섹션 -->
      <q-card-section class="flex">
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <!-- 다양한 인증 뷰를 동적으로 로드하는 카드 섹션 -->
      <q-card-section class="q-px-xl q-pb-xl">
        <!-- 현재 활성화된 뷰 컴포넌트를 로드 -->
        <component
          :is="authViewComponents[viewMode]"
          @change-view="changeViewMode"
          @close-dialog="closeDialog"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { defineAsyncComponent, ref } from 'vue';

// 다이얼로그의 표시 여부와 관련된 prop 정의
defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});
defineEmits(['update:modelValue']);

// 현재 활성화된 뷰 모드 (로그인, 회원가입, 비밀번호 찾기)
const viewMode = ref('SignInForm');

// 뷰 모드 변경 함수
const changeViewMode = mode => (viewMode.value = mode);

// 인증 관련 컴포넌트를 비동기적으로 로드하는 객체
const authViewComponents = {
  SignInForm: defineAsyncComponent(() => import('./SignInForm.vue')),
  SignUpForm: defineAsyncComponent(() => import('./SignUpForm.vue')),
  FindPasswordForm: defineAsyncComponent(() =>
    import('./FindPasswordForm.vue'),
  ),
};

const closeDialog = () => {
  emit('update:modelValue', false);
};
</script>

<style lang="scss" scoped></style>
