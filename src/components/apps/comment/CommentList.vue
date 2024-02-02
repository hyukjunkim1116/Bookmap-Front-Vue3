<template>
  <q-list class="q-mt-lg bg-white" bordered separator>
    <CommentItem
      v-for="item in items"
      :key="item.id"
      v-bind="item"
      @delete="handleDeleteComment(item.id)"
    />
  </q-list>
</template>

<script setup>
import { useAsyncState } from '@vueuse/core';
import { deleteComment } from 'src/services';
import { useQuasar } from 'quasar';
import CommentItem from './CommentItem.vue';
const $q = useQuasar();
defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(['deleted']);
const { execute } = useAsyncState(
  async () => await deleteComment(commentId),
  null,
  {
    immediate: false,
    onSuccess: () => {
      emit('deleted');
    },
  },
);
const handleDeleteComment = commentId => {
  console.log(commentId, '123');
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
    console.log(commentId);
    await execute(commentId);
  });
};
</script>

<style lang="scss" scoped></style>
