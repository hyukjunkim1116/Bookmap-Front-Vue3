<template>
  <!-- 페이지 컨테이너: 포스트 리스트와 관련된 레이아웃을 정의 -->
  <q-page padding>
    <!-- 포스트 관련 주요 세 컬럼 레이아웃 -->
    <div class="row q-col-gutter-x-lg">
      <!-- 중앙 포스트 리스트 섹션 -->
      <section class="col-7">
        <PostHeader v-model:sort="sort" v-model:search="search" />
        <PostListSkeleton v-if="isLoading" />
        <PostList :items="items" escapeHTML />
        <div v-intersection-observer="handleIntersectionObserver"></div>
      </section>
      <!-- 오른쪽 사이드바 컴포넌트 -->
      <PostRightBar
        class="col-3"
        @open-write-dialog="openWriteDialog"
        @open-chat-view-dialog="openChatViewDialog"
      />
    </div>
    <PostWriteDialog
      v-model="postDialog"
      @complete="completeRegistrationPost"
    />
    <WebChat v-model="chatDialog" />
  </q-page>
</template>
<script setup>
import { ref, onMounted, computed, watch, defineAsyncComponent } from 'vue';
import { useQuasar } from 'quasar';
import { getPosts } from 'src/services';
import { useAuthStore } from 'src/stores/auth';
import { useAsyncState } from '@vueuse/core';
import { vIntersectionObserver } from '@vueuse/components';
import { getErrorMessage } from 'src/utils/error-message';
import { usePostQuery } from 'src/composables/usePostQuery';
import PostHeader from './components/PostHeader.vue';
import WebChat from 'src/components/apps/chat/WebChat.vue';
import PostRightBar from 'src/pages/components/PostRightBar.vue';
import PostWriteDialog from 'src/components/apps/post/PostWriteDialog.vue';
import PostList from 'src/components/apps/post/PostList.vue';
import PostListSkeleton from 'src/components/skeletons/PostListSkeleton.vue';
const { sort, search } = usePostQuery();
const $q = useQuasar();
const authStore = useAuthStore();
const items = ref([]);
const params = computed(() => ({
  sort: sort.value,
  search: search.value,
}));
const page = ref(1);
const postDialog = ref(false);
const chatDialog = ref(false);
const isParamsChanged = ref(false);
const isLoadMore = ref(true);
const { execute, isLoading } = useAsyncState(getPosts, [], {
  immediate: false,
  throwError: true,
  onSuccess: response => {
    console.log(response.data);
    if (response.data.next) {
      isLoadMore.value = true;
      page.value += 1;
    } else {
      isLoadMore.value = false;
    }
    if (isParamsChanged.value) {
      items.value = response?.data.results;
    } else {
      items.value = items.value.concat(response?.data.results);
    }
  },
  onError: err => {
    console.log(err);
    $q.notify({
      type: 'negative',
      message: getErrorMessage(err.response?.data),
    });
  },
});

const openWriteDialog = () => {
  if (!authStore.isLogin) {
    $q.notify('로그인 후 이용 가능합니다!');
    return;
  }
  postDialog.value = true;
};

const completeRegistrationPost = () => {
  postDialog.value = false;
  isParamsChanged.value = true;
  page.value = 1;
  items.value = [];
  execute(getPosts, { ...params.value, page: page.value });
};
onMounted(() => {
  execute(getPosts, params.value);
});
watch(
  params,
  () => {
    console.log('paramsChanged');
    isParamsChanged.value = true;
    page.value = 1;
    execute(getPosts, { ...params.value, page: page.value });
  },
  {
    deep: true,
    // immediate: true,
  },
);
const loadMore = () => {
  isParamsChanged.value = false;
  execute(getPosts, { ...params.value, page: page.value });
};
const openChatViewDialog = () => {
  if (!authStore.isLogin) {
    $q.notify('로그인 후 이용 가능합니다!');
    return;
  }
  chatDialog.value = true;
};

const handleIntersectionObserver = ([{ isIntersecting }]) => {
  if (isIntersecting && isLoadMore.value) {
    console.log('### handleIntersectionObserver ###');
    loadMore();
  }
};
</script>

<style lang="scss" scoped></style>
