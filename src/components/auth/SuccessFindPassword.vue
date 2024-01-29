<template>
  <div class="q-gutter-y-md">
    <div class="text-h5 text-center text-weight-bold q-mb-xl">
      비밀번호 확인
    </div>
    <div class="text-h9 text-center">
      새로운 비밀번호 입니다 : {{ newRandomPassword }}
    </div>
    <q-separator />
    <q-btn
      label="로그인 하기"
      class="full-width"
      unelevated
      flat
      color="primary"
      @click="changeView"
    />
  </div>
</template>

<script setup>
const emit = defineEmits('changeView');

const changeView = () => {
  emit('changeView', 'SignInForm');
};

const props = defineProps({
  newRandomPassword: {
    type: String,
    default: '',
  },
});
</script>

<style lang="scss" scoped></style>
