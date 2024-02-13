<template>
  <q-dialog persistent transition-show="none" transition-hide="none">
    <q-card :style="{ minWidth: '660px' }">
      <q-toolbar>
        <q-toolbar-title>대화 및 방명록</q-toolbar-title>
        <q-btn v-close-popup flat round dense icon="close" />
      </q-toolbar>
      <q-separator />
      <!-- 대화 목록 -->
      <div style="height: 300px; overflow-y: auto">
        <!-- <div v-for="(message, index) in messages" :key="index" class="message">
          {{ message }}
        </div> -->
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
        label="채팅보기"
        @click="getGuestChat"
      />
      <q-btn
        class="q-mt-md"
        color="primary"
        label="서버열기"
        @click="openGuestChat"
      />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useQuasar } from 'quasar';
import { getChats } from 'src/services';
import { useAuthStore } from 'src/stores/auth';
import { useAsyncState } from '@vueuse/core';
import { useWebSocket } from '@vueuse/core';
import { getErrorMessage } from 'src/utils/error-message';
const authStore = useAuthStore();
const uid = authStore.loginUser.uid || null;
const guestChat = ref('');
const { status, data, send, open, close } = useWebSocket(
  `ws://127.0.0.1:8000?uid=${uid}`,
);
const $q = useQuasar();
const { execute, isLoading } = useAsyncState(getChats, [], {
  immediate: false,
  throwError: true,
  onSuccess: response => {
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
  open();

  console.log('try');
};
const saveGuestChat = () => {
  send(guestChat.value);
  console.log('send!');
  getChats.value = '';
};
onMounted(() => {});
</script>

<style lang="scss" scoped></style>
