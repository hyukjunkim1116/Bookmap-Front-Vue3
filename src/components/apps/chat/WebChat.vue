<template>
  <q-dialog persistent transition-show="none" transition-hide="none">
    <q-card :style="{ minWidth: '660px' }">
      <q-toolbar>
        <q-toolbar-title v-if="status.value === 'CONNECTING'"
          >대화 및 방명록</q-toolbar-title
        >
        <q-toolbar-title v-else>방명록 불러오는중 ...</q-toolbar-title>
        <q-btn v-close-popup flat round dense icon="close" />
      </q-toolbar>
      <q-separator />
      <!-- 대화 목록 -->
      <div style="height: 300px; overflow-y: auto">
        <WebChatItem v-for="data in diaryDatas" :key="data.id" v-bind="data" />
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
import { useWebSocket } from '@vueuse/core';
import { getErrorMessage } from 'src/utils/error-message';
import WebChatItem from './WebChatItem.vue';
const authStore = useAuthStore();
const uid = authStore.loginUser.uid || null;
const guestChat = ref('');
const { status, data, send, open, close, error } = useWebSocket(
  `ws://127.0.0.1:8000?uid=${uid}`,
);
const diaryDatas = ref([]);
const $q = useQuasar();
const { execute, isLoading } = useAsyncState(getChats, [], {
  immediate: false,
  throwError: true,
  onSuccess: response => {
    diaryDatas.value = response.data;
    console.log(response.data, 'ㅁㄴㅇㅁㄴㅇ');
  },
  onError: err => {
    console.log(err, 'ㅁㄴㅇㅁㄴㅇ111');
    $q.notify({
      type: 'negative',
      message: getErrorMessage(err.response?.data),
    });
  },
});
const getGuestChat = () => {
  execute(getChats);
};
const openGuestChat = () => {
  console.log(status.value, 'status');
  open();
  console.log(status.value, 'status');
};
const closeGuestChat = () => {
  close();
};
const saveGuestChat = () => {
  send(
    JSON.stringify({
      message: guestChat.value,
    }),
  );
  console.log('send!');
  getChats.value = '';
  execute();
};
onMounted(() => {
  console.log(status, 'statu123s');
  execute();
});
</script>

<style lang="scss" scoped></style>
