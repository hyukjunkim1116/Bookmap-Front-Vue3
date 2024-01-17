<template>
  <!-- 페이지 컨테이너: 포스트 리스트와 관련된 레이아웃을 정의 -->
  <q-page padding>
    <!-- 포스트 관련 주요 세 컬럼 레이아웃 -->
    <div class="row q-col-gutter-x-lg">
      <!-- 중앙 포스트 리스트 섹션 -->
      <section class="col-7"></section>
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
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import PostRightBar from 'src/components/base/PostRightBar.vue';
import PostWriteDialog from 'src/components/apps/post/PostWriteDialog.vue';

const router = useRouter();
// 포스트 목록 데이터 생성
const posts = Array.from(Array(20), (_, index) => ({
  id: 'A' + index,
  title: 'Vue3 Firebase 강의 ' + index,
  // 기타 포스트 관련 데이터
  content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit...',
  readCount: 1,
  commentCount: 2,
  likeCount: 3,
  bookmarkCount: 4,
  tags: ['html', 'css', 'javascript'],
  uid: 'uid',
  category: '카테고리' + index,
}));
const postDialog = ref(false);
const openWriteDialog = () => {
  // if (!authStore.isAuthenticated) {
  //   alert('로그인 후 이용 가능합니다.');
  //   return;
  // }
  postDialog.value = true;
};
const completeRegistrationPost = () => {
  postDialog.value = false;
  start.value = null;
  execute(0, params.value);
};
</script>

<style lang="scss" scoped></style>
