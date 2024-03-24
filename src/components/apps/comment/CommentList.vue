<template>
  <q-list class="q-mt-lg bg-white" bordered separator>
    <CommentItem
      v-for="item in items"
      :key="item.id"
      v-bind="item"
      @delete="handleDeleteComment"
      @edit="handleEditComment"
    />
  </q-list>
</template>

<script setup>
import { useAsyncState } from '@vueuse/core';
import { deleteComment, editComment } from 'src/services';
import { useQuasar } from 'quasar';

import CommentItem from './CommentItem.vue';
const $q = useQuasar();
defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(['deleted', 'edited']);
const { execute: executeDeleteComment } = useAsyncState(deleteComment, null, {
  immediate: false,
  onSuccess: () => {
    emit('deleted');
  },
  onError: err => {
    $q.notify({
      type: 'negative',
      message: err.response.data.message,
    });
  },
});
const { execute: executeEditComment } = useAsyncState(editComment, null, {
  immediate: false,
  onSuccess: () => {
    emit('edited');
  },
  onError: err => {
    $q.notify({
      type: 'negative',
      message: err.response.data.message,
    });
  },
});

const handleDeleteComment = commentId => {
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
    await executeDeleteComment(deleteComment, commentId);
  });
};
const handleEditComment = (commentId, editedComment) => {
  executeEditComment(editComment, commentId, { comment: editedComment });
};
</script>

<style lang="scss" scoped></style>
