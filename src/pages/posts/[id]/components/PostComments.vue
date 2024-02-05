<template>
  <div>
    <div class="text-subtitle1 text-weight-bold q-mb-lg">
      댓글 수 {{ commentCount }}
    </div>
    <div v-if="isActive">
      <q-form @submit.prevent="handleAddComment">
        <q-input
          v-model="message"
          type="textarea"
          outlined
          hide-bottom-space
          :rules="[validateRequired]"
        ></q-input>
        <div class="flex justify-end q-gutter-x-sm q-mt-sm">
          <q-btn label="취소" color="dark" unelevated @click="toggleActive" />
          <q-btn
            type="submit"
            label="등록"
            color="primary"
            unelevated
            :loading="isLoading"
          />
        </div>
      </q-form>
    </div>

    <BaseCard v-if="!isActive" @click="toggleActive" class="cursor-pointer">
      <q-card-section class="flex items-center">
        <q-avatar>
          <img src="https://cdn.quasar.dev/img/avatar.png" />
        </q-avatar>
        <div class="text-grey-6 q-ml-md">댓글을 작성해보세요.</div>
      </q-card-section>
    </BaseCard>

    <CommentList
      :post-id="$route.params.id"
      :items="items"
      @deleted="deletedComment"
      @edited="editedComment"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute } from 'vue-router';
import { useAsyncState } from '@vueuse/core';
import { useAuthStore } from 'src/stores/auth';
import { addComment, getComments } from 'src/services';
import BaseCard from 'src/components/base/BaseCard.vue';
import CommentList from 'src/components/apps/comment/CommentList.vue';
import { validateRequired } from 'src/utils/validate-rules';

const items = ref([]);
const commentCount = ref();
const route = useRoute();
const authStore = useAuthStore();
const $q = useQuasar();
const isActive = ref(false);
const message = ref('');
const toggleActive = () => {
  if (!isActive.value && !authStore.isLogin) {
    $q.notify({
      type: 'negative',
      message: '로그인 후 이용 가능합니다.',
    });
    return;
  }
  isActive.value = !isActive.value;
};

const { execute: executeGetComments } = useAsyncState(getComments, [], {
  immediate: false,
  throwError: true,
  onSuccess: response => {
    console.log(response.data);
    items.value = response?.data;
    commentCount.value = response.data[0]?.comment_count || 0;
  },
});

const { isLoading, execute: executeAddComment } = useAsyncState(
  async () =>
    await addComment(route.params.id, {
      comment: message.value,
      uid: authStore.getUserData.uid,
    }),
  null,
  {
    immediate: false,
    throwError: true,
    onSuccess: () => {
      message.value = '';
      isActive.value = false;
      executeGetComments(getComments, route.params.id);
    },
  },
);
const handleAddComment = async () => {
  executeAddComment(route.params.id, {
    message: message.value,
    uid: authStore.getUserData.uid,
  });
};
const deletedComment = () => {
  $q.notify({
    message: '삭제 되었습니다.',
  });
  executeGetComments(getComments, route.params.id);
};
const editedComment = () => {
  $q.notify({
    message: '수정 되었습니다.',
  });
  executeGetComments(getComments, route.params.id);
};
onMounted(() => {
  executeGetComments(getComments, route.params.id);
});
</script>

<style lang="scss" scoped></style>
