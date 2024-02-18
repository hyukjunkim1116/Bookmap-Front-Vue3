<template>
  <q-dialog persistent transition-show="none" transition-hide="none">
    <q-card :style="{ minWidth: '660px' }">
      <q-toolbar>
        <q-toolbar-title>방명록 남기기</q-toolbar-title>
        <q-btn v-close-popup flat round dense icon="close" />
      </q-toolbar>
      <q-separator />
      <!-- 대화 목록 -->
      <div style="height: 300px; overflow-y: auto">
        <WebChatItem
          v-for="data in webSocket.messages?.value"
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
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth';
import { useWebChat } from 'src/composables/useWebChat';
import WebChatItem from './WebChatItem.vue';
const authStore = useAuthStore();
const uid = computed(() => {
  return authStore.loginUser?.uid || null;
});
const guestChat = ref('');
const webSocket = useWebChat(uid.value);
const $q = useQuasar();
const saveGuestChat = () => {
  webSocket.send(
    JSON.stringify({
      message: guestChat.value,
    }),
  );
  guestChat.value = '';
};
</script>

<style lang="scss" scoped></style>
