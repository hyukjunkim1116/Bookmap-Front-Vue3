<template>
  <q-dialog
    persistent
    v-bind="$attrs"
    @hide="onHide"
    transition-show="none"
    transition-hide="none"
  >
    <q-card :style="{ minWidth: '660px' }">
      <q-toolbar>
        <q-toolbar-title>글쓰기</q-toolbar-title>
        <q-btn v-close-popup flat round dense icon="close" />
      </q-toolbar>
      <q-separator />
      <PostForm
        v-model:title="form.title"
        v-model:content="form.content"
        :loading="isLoading"
        @submit="execute({ ...form, uid: authStore.uid })"
      />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAsyncState } from '@vueuse/core';
import { useAuthStore } from 'src/stores/auth';
import { createPost } from 'src/services';
import PostForm from 'src/components/apps/post/PostForm.vue';

const emit = defineEmits(['complete']);
const authStore = useAuthStore();

const getInitialForm = () => ({
  title: '',
  content: '',
  uid: authStore.uid,
});
const form = ref(getInitialForm());
const onHide = () => {
  form.value = getInitialForm();
};

const { isLoading, execute } = useAsyncState(createPost, null, {
  immediate: false,
  throwError: true,
  onSuccess: () => {
    emit('complete');
  },
});
</script>

<style lang="scss" scoped></style>
