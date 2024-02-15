<template>
  <q-dialog persistent transition-show="none" transition-hide="none">
    <q-card :style="{ minWidth: '660px' }">
      <q-toolbar>
        <!-- <q-toolbar-title v-if="status.value === 'CONNECTING'"
          >대화 및 방명록</q-toolbar-title
        > -->
        <q-toolbar-title>방명록 불러오는중 ...</q-toolbar-title>
        <q-btn v-close-popup flat round dense icon="close" />
      </q-toolbar>
      <q-separator />
      <!-- 대화 목록 -->
      <div style="height: 300px; overflow-y: auto">
        <WebChatItem
          v-for="data in webSocket.data.value"
          :key="data.id"
          v-bind="data"
        />
      </div>
      <q-separator />
      <!-- 방명록 입력 -->
      <q-input v-model="guestChat" filled label="방명록 입력" />
      <q-btn
        class="q-mt-md"
        color="primary"
        label="저장"
        @click="saveGuestChat"
      />
      <q-btn
        class="q-mt-md"
        color="primary"
        label="서버열기"
        @click="openGuestChat"
      />
      <q-btn
        class="q-mt-md"
        color="primary"
        label="서버닫기"
        @click="closeGuestChat"
      />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { getChats } from 'src/services';
import { useAuthStore } from 'src/stores/auth';
import { useAsyncState } from '@vueuse/core';
import { useWebSocketQuery } from 'src/composables/useWebSocket';
import { getErrorMessage } from 'src/utils/error-message';
import WebChatItem from './WebChatItem.vue';
const authStore = useAuthStore();
const guestChat = ref('');
const webSocket = useWebSocketQuery();
const messages = ref([]);
const $q = useQuasar();
const openGuestChat = () => {
  webSocket.open();
  console.log(webSocket.data.value);
};
const closeGuestChat = () => {
  webSocket.close();
};
const saveGuestChat = () => {
  webSocket.send(
    JSON.stringify({
      message: guestChat.value,
    }),
  );
  console.log(webSocket.data.value, 'send');
  getChats.value = '';
};
onMounted(() => {
  if (authStore.loginUser?.uid) {
    webSocket.open();
  }
});
</script>

<style lang="scss" scoped></style>
