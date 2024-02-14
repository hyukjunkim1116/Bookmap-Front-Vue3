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
      to="/payments"
    >
      <span class="text-weight-bold">결제하기</span>
    </q-btn>
    <q-btn
      padding="8px 12px 8px 8px"
      unelevated
      color="primary"
      text-color="white"
      class="full-width"
      @click.prevent="$emit('openChatDialog')"
    >
      <span class="text-weight-bold">방명록남기기</span>
    </q-btn>
  </StickySideBar>
</template>
<script setup>
import StickySideBar from 'src/components/StickySideBar.vue';
const emit = defineEmits(['openWriteDialog', 'openChatDialog']);
</script>

<style lang="scss" scoped></style>
