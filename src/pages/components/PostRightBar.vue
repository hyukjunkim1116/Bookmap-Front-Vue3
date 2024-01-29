<template>
  <StickySideBar>
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
  </StickySideBar>
</template>
<script setup>
import StickySideBar from 'src/components/StickySideBar.vue';
const emit = defineEmits(['openWriteDialog']);
</script>

<style lang="scss" scoped></style>
