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
          <img :src="authStore.loginUser?.image || '/logo.png'" />
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
    <div v-intersection-observer="handleIntersectionObserver"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute } from 'vue-router';
import { useAsyncState } from '@vueuse/core';
import { useAuthStore } from 'src/stores/auth';
import { vIntersectionObserver } from '@vueuse/components';
import { addComment, getComments } from 'src/services';
import BaseCard from 'src/components/base/BaseCard.vue';
import CommentList from 'src/components/apps/comment/CommentList.vue';
import { validateRequired } from 'src/utils/validate-rules';
const page = ref(1);
const isLoadMore = ref(true);
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

const { execute: executeGetComments, state } = useAsyncState(getComments, [], {
  immediate: false,
  throwError: true,
  onSuccess: async response => {
    const data = await response.data;
    console.log(response.data, 'commentresdata');
    if (page.value == 1) {
      items.value = data.results;
    } else {
      items.value = items.value.concat(data.results);
    }

    if (response.data.next) {
      isLoadMore.value = true;
      page.value += 1;
    } else {
      isLoadMore.value = false;
    }
    commentCount.value = response.data.count;
  },
});

const { isLoading, execute: executeAddComment } = useAsyncState(
  addComment,
  null,
  {
    immediate: false,
    throwError: true,
    onSuccess: () => {
      message.value = '';
      isActive.value = false;
      page.value = 1;

      executeGetComments(getComments, route.params.id, page.value);
    },
  },
);
const handleAddComment = async () => {
  executeAddComment(addComment, route.params.id, {
    comment: message.value,
  });
};
const deletedComment = () => {
  $q.notify({
    message: '삭제 되었습니다.',
  });
  page.value = 1;
  executeGetComments(getComments, route.params.id, page.value);
};
const editedComment = () => {
  $q.notify({
    message: '수정 되었습니다.',
  });
  page.value = 1;
  executeGetComments(getComments, route.params.id, page.value);
};
const loadMore = async () => {
  await executeGetComments(getComments, route.params.id, page.value);
};
const handleIntersectionObserver = async ([{ isIntersecting }]) => {
  if (isIntersecting && isLoadMore.value) {
    await loadMore();
  }
};
onMounted(() => {
  executeGetComments(getComments, route.params.id, page.value);
});
</script>

<style lang="scss" scoped></style>
