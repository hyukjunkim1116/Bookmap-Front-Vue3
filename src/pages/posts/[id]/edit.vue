<template>
  <q-page padding>
    <BaseCard>
      <q-toolbar>
        <q-toolbar-title>수정하기</q-toolbar-title>
      </q-toolbar>
      <q-separator />
      <PostForm
        v-model:title="form.title"
        v-model:content="form.content"
        @submit="handleSubmit"
      >
        <template #actions>
          <q-btn flat label="취소" @click="$router.back()" />
          <q-btn
            type="submit"
            flat
            label="수정"
            color="primary"
            :loading="isLoading"
          />
        </template>
      </PostForm>
    </BaseCard>
  </q-page>
</template>
<script>
const getInitialForm = () => ({
  title: '',
  content: '',
});
</script>
<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { getPostDetails, updatePost } from 'src/services';
import { useAsyncState } from '@vueuse/core';
import { getErrorMessage } from 'src/utils/error-message';
import BaseCard from 'src/components/base/BaseCard.vue';
import PostForm from 'src/components/apps/post/PostForm.vue';
const router = useRouter();
const route = useRoute();
const $q = useQuasar();
const form = ref(getInitialForm());
useAsyncState(
  async () => await getPostDetails(route.params.id),
  {},
  {
    onSuccess: response => {
      form.value.title = response.data.title;
      form.value.content = response.data.content;
    },
    onError: err => {
      $q.notify({
        type: 'negative',
        message: getErrorMessage(err.response.data),
      });
    },
  },
);

const { isLoading, execute: executeUpdatePost } = useAsyncState(
  async () => {
    const response = await updatePost(route.params.id, form.value);
    return response;
  },
  null,
  {
    immediate: false,
    throwError: true,
    onSuccess: () => {
      $q.notify('수정완료!');
      router.back();
    },
    onError: err => {
      $q.notify({
        type: 'negative',
        message: getErrorMessage(err.response.data),
      });
    },
  },
);

const handleSubmit = async () => {
  $q.dialog({
    title: '알림',
    message: '수정 하시겠어요?',
    persistent: true,
    cancel: true,
    ok: {
      push: true,
    },
    cancel: {
      push: true,
      color: 'negative',
    },
  }).onOk(async () => {
    await executeUpdatePost(route.params.id, form.value);
  });
};
</script>

<style lang="scss" scoped></style>
<route lang="yaml">
meta:
  width: 800px
</route>
