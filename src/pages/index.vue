<template>
  <!-- 페이지 컨테이너: 포스트 리스트와 관련된 레이아웃을 정의 -->
  <q-page padding>
    <!-- 포스트 관련 주요 세 컬럼 레이아웃 -->
    <div class="row q-col-gutter-x-lg">
      <!-- 왼쪽 사이드바 컴포넌트 -->
      <PostLeftBar class="col-grow" />
      <!-- 중앙 포스트 리스트 섹션 -->
      <section class="col-7">
        <!-- 포스트 헤더 -->
        <PostHeader />
        <!-- 포스트 리스트 컴포넌트 -->
        <PostList :items="posts" />
      </section>
      <!-- 오른쪽 사이드바 컴포넌트 -->
      <PostRightBar class="col-3" @open-write-dialog="openWriteDialog" />
    </div>
    <!-- 포스트 작성 다이얼로그 컴포넌트 -->
    <PostWriteDialog
      :model-value="postDialog"
      @update:model-value="val => (postDialog = val)"
    />
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import PostList from 'src/components/apps/post/PostList.vue';
import PostHeader from './components/PostHeader.vue';
import PostLeftBar from './components/PostLeftBar.vue';
import PostRightBar from './components/PostRightBar.vue';
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

// 포스트 작성 다이얼로그의 표시 여부를 관리하는 ref
const postDialog = ref(false);
// 포스트 작성 다이얼로그를 열기 위한 함수
const openWriteDialog = () => {
  postDialog.value = true;
};
</script>

<style lang="scss" scoped></style>
