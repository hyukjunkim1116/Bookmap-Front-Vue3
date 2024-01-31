<template>
  <BaseCard class="q-pa-lg">
    <div class="flex q-mb-md">
      <q-btn
        icon="sym_o_arrow_back"
        flat
        round
        dense
        color="grey"
        size="16px"
        @click="$router.back()"
      />
      <q-space />
    </div>
    <div class="flex items-center">
      <q-avatar>
        <img src="/logo.png" />
      </q-avatar>
      <div class="q-ml-md">
        <div>{{ post.author?.username }}</div>
        <div class="text-grey-6">
          {{ date.formatDate(post.created_at, 'YYYY. MM. DD HH:mm:ss') }}
        </div>
      </div>
      <q-space />
      <q-btn
        v-if="authStore.hasOwnContent(post.author?.uid)"
        icon="more_horiz"
        round
        flat
      >
        <q-menu>
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup :to="`/posts/${post.id}/edit`">
              <q-item-section>수정하기</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="handleDeletePost">
              <q-item-section>삭제하기</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>

    <div class="q-mt-md text-h5 text-weight-bold">{{ post.title }}</div>
    <q-separator class="q-my-lg" />

    <TiptapViewer v-if="post.content" :content="post.content" />
  </BaseCard>
</template>

<script setup>
import { ref } from 'vue';
import { date, useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from 'stores/auth';
import { useAsyncState } from '@vueuse/core';
import { getErrorMessage } from 'src/utils/error-message';
import { deletePost, getPostDetails } from 'src/services';
import BaseCard from 'src/components/base/BaseCard.vue';
import TiptapViewer from 'src/components/tiptap/TiptapViewer.vue';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const authStore = useAuthStore();
const post = ref({});

const { error } = useAsyncState(
  async () => {
    const response = await getPostDetails(route.params.id);
    return response;
  },
  {},
  {
    onSuccess: response => {
      post.value = response.data;
    },
    onError: err => {
      $q.notify({
        type: 'negative',
        message: getErrorMessage(err.response.data),
      });
    },
  },
);
const { execute: executeDeletePost } = useAsyncState(
  async () => await deletePost(post.value.id),
  null,
  {
    immediate: false,
    onSuccess: () => {
      $q.notify('삭제완료!');
      router.push('/');
    },
    onError: err => {
      $q.notify({
        type: 'negative',
        message: getErrorMessage(err.response.data),
      });
    },
  },
);
const handleDeletePost = async () => {
  $q.dialog({
    title: '알림',
    message: '삭제 하시겠어요?',
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
    await executeDeletePost(route.params.id);
  });
};
</script>

<style lang="scss" scoped></style>
