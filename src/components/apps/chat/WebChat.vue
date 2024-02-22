<template>
  <q-dialog persistent transition-show="none" transition-hide="none">
    <q-card :style="{ minWidth: '660px' }">
      <q-toolbar>
        <q-toolbar-title>방명록 남기기</q-toolbar-title>
        <q-btn v-close-popup flat round dense icon="close" />
      </q-toolbar>
      <q-separator />
      <div style="height: 300px; overflow-y: auto">
        <WebChatItem
          v-for="data in webSocket.messages.value"
          :key="data.id"
          v-bind="data"
        />
        <span ref="bottom"></span>
      </div>
      <q-separator />
      <q-input
        v-model="guestChat"
        filled
        label="방명록 입력"
        @keyup.enter.prevent="saveGuestChat"
      />
      <q-btn
        class="q-mt-md"
        color="primary"
        label="저장"
        @click.prevent="saveGuestChat"
      />
      <q-btn
        class="q-mt-md"
        color="primary"
        label="맨밑으로 내리기"
        @click.prevent="scrollToBottom"
      />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { useWebChat } from 'src/services';
import WebChatItem from './WebChatItem.vue';
const webSocket = useWebChat();
const guestChat = ref('');
const bottom = ref(null);
const scrollToBottom = () => {
  bottom.value.scrollIntoView({ behavior: 'smooth' });
};

const saveGuestChat = () => {
  webSocket.send(
    JSON.stringify({
      message: guestChat.value,
    }),
  );
  guestChat.value = '';
  scrollToBottom();
};
</script>

<style lang="scss" scoped></style>
