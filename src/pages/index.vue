<template>
  <!-- 페이지 컨테이너: 포스트 리스트와 관련된 레이아웃을 정의 -->
  <q-page padding>
    <!-- 포스트 관련 주요 세 컬럼 레이아웃 -->
    <div class="row q-col-gutter-x-lg">
      <!-- 중앙 포스트 리스트 섹션 -->
      <section class="col-7">
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
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { getPosts } from 'src/services';
import { useLoginStore } from 'src/stores/isLogin';
import { useAsyncState } from '@vueuse/core';
import PostRightBar from 'src/components/base/PostRightBar.vue';
import PostWriteDialog from 'src/components/apps/post/PostWriteDialog.vue';
import PostList from 'src/components/apps/post/PostList.vue';
const $q = useQuasar();
const loginStore = useLoginStore();
const items = ref([]);
const { execute, isLoading } = useAsyncState(
  async () => {
    // signUpWithEmail 함수에 form 데이터를 전달
    const response = await getPosts();
    return response;
  },
  [],
  {
    immediate: false,
    throwError: true,
    onSuccess: response => {
      console.log('responses:', response);
      console.log(items.value, 'asdasd', response.data);
      items.value = response.data;
      console.log('items', items);
    },
    onError: error => {
      console.log('errorerrror:', error);
    },
  },
);
const postDialog = ref(false);
const openWriteDialog = () => {
  if (!loginStore.isLogin) {
    $q.notify('로그인 후 이용 가능합니다!');
    return;
  }
  postDialog.value = true;
};
const completeRegistrationPost = () => {
  postDialog.value = false;
  execute();
};
onMounted(items => {
  execute();
});
</script>

<style lang="scss" scoped></style>
