import { defineStore } from 'pinia';
import { inject, ref } from 'vue'
import { onMessage, onOpen, onClose, onError } from 'vue3-websocket'
export const useAuthStore = defineStore('websocket', {
  state: () => ({}),
  actions: {},
});
