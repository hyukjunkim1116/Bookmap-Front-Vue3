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
      @click.prevent="showChatDialog"
    >
      <span class="text-weight-bold">방명록남기기</span>
      <WebChat v-if="authStore.isLogin" v-model="dialogVisible" />
    </q-btn>
  </StickySideBar>
</template>
<script setup>
import { ref } from 'vue';
import { useAuthStore } from 'src/stores/auth';
import { useQuasar } from 'quasar';
import StickySideBar from 'src/components/StickySideBar.vue';
import WebChat from 'src/components/apps/chat/WebChat.vue';
const $q = useQuasar();
const authStore = useAuthStore();
const emit = defineEmits(['openWriteDialog']);
const dialogVisible = ref(false);
const showChatDialog = () => {
  if (!authStore.isLogin) {
    $q.notify('로그인 후 이용 가능합니다!');
    return;
  }
  dialogVisible.value = true;
};
</script>

<style lang="scss" scoped></style>
