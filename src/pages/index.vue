<template>
  <!-- 페이지 컨테이너: 포스트 리스트와 관련된 레이아웃을 정의 -->
  <q-page padding>
    <!-- 포스트 관련 주요 세 컬럼 레이아웃 -->
    <div class="row q-col-gutter-x-lg">
      <!-- 중앙 포스트 리스트 섹션 -->
      <section class="col-7">
        <PostHeader v-model:sort="sort" />
        <PostListSkeleton v-if="isLoading" />
        <PostList :items="items" escapeHTML />
        <!-- <div v-intersection-observer="handleIntersectionObserver"></div> -->
      </section>
      <!-- 오른쪽 사이드바 컴포넌트 -->
      <PostRightBar class="col-3" @open-write-dialog="openWriteDialog" />
    </div>
    <PostWriteDialog
      v-model="postDialog"
      @complete="completeRegistrationPost"
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useQuasar } from 'quasar';
import { getPosts } from 'src/services';
import { useAuthStore } from 'src/stores/auth';
import { useAsyncState } from '@vueuse/core';
import { getErrorMessage } from 'src/utils/error-message';
import { usePostQuery } from 'src/composables/usePostQuery';
import PostHeader from './components/PostHeader.vue';
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
}));
const { execute, isLoading } = useAsyncState(getPosts, [], {
  immediate: false,
  throwError: true,
  onSuccess: response => {
    items.value = response?.data.results;
  },
  onError: err => {
    $q.notify({
      type: 'negative',
      message: getErrorMessage(err.response?.data),
    });
  },
});
const postDialog = ref(false);
const openWriteDialog = () => {
  if (!authStore.isLogin) {
    $q.notify('로그인 후 이용 가능합니다!');
    return;
  }
  postDialog.value = true;
};
const completeRegistrationPost = () => {
  postDialog.value = false;
  execute(getPosts, params.value);
  // execute(0, params.value);
};
onMounted(() => {
  execute(getPosts, params.value);
});
watch(
  params,
  () => {
    execute(getPosts, params.value);
  },
  {
    deep: true,
    // immediate: true,
  },
);
</script>

<style lang="scss" scoped></style>
