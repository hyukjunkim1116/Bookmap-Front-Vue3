<template>
  <StickySideBar class="q-gutter-y-sm">
    <q-btn
      padding="8px 12px 8px 8px"
      unelevated
      color="primary"
      text-color="white"
      class="full-width"
      @click="$emit('openWriteDialog')"
    >
      <q-avatar class="q-mr-sm" color="white" text-color="primary" size="22px">
        <q-icon name="edit" size="14px" />
      </q-avatar>
      <span class="text-weight-bold">새 포스트 작성하기</span>
    </q-btn>
    <q-btn
      padding="8px 12px 8px 8px"
      unelevated
      color="primary"
      text-color="white"
      class="full-width"
      @click="execute"
    >
      <span class="text-weight-bold">카카오 페이 결제하기</span>
    </q-btn>
  </StickySideBar>
</template>
<script setup>
import StickySideBar from 'src/components/StickySideBar.vue';
import { payToKakao } from 'src/services';
import { useAsyncState } from '@vueuse/core';
import { useQuasar } from 'quasar';
const $q = useQuasar();
const emit = defineEmits(['openWriteDialog']);

const { execute } = useAsyncState(payToKakao, null, {
  immediate: false,
  onSuccess: response => {
    console.log(response.data, '2323');
  },
  onError: err => {
    console.log(err);
    $q.notify({
      type: 'negative',
      message: 'asd',
    });
  },
});
</script>

<style lang="scss" scoped></style>
