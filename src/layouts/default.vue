<template>
  <!-- Quasar 레이아웃 구성: 헤더, 페이지 컨테이너 및 인증 다이얼로그 포함 -->
  <q-layout view="lHh Lpr lff" class="bg-grey-2">
    <!-- 헤더 섹션 -->
    <q-header bordered class="bg-white text-grey-9">
      <q-toolbar>
        <!-- 로고 및 홈 링크 버튼 -->
        <q-btn flat dense to="/">
          <q-toolbar-title>
            <q-avatar>
              <img src="/logo.png" />
            </q-avatar>
            FoodMap
          </q-toolbar-title>
        </q-btn>
        <!-- 툴바 우측 공간 -->
        <q-space />
        <!-- 홈 버튼 -->
        <q-btn stretch flat label="Home" to="/home" />
        <!-- 로그인/회원가입 버튼 -->
        <q-separator class="q-my-md q-mr-md" vertical />
        <q-btn
          unelevated
          rounded
          color="primary"
          label="로그인 / 회원가입"
          @click="openAuthDialog"
        />
        <!-- 사용자 프로필 및 메뉴 -->
        <q-btn round flat>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/avatar.png" />
          </q-avatar>
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup to="/mypage/profile">
                <q-item-section>프로필</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>로그아웃</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- 페이지 컨테이너: 여기에 라우터 뷰가 위치함 -->
    <q-page-container :style="pageContainerStyles">
      <router-view />
    </q-page-container>
    <!-- 인증 관련 다이얼로그 컴포넌트 -->
    <AuthDialog v-model="authDialog" />
  </q-layout>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

import AuthDialog from 'src/components/auth/AuthDialog.vue';

const route = useRoute();
// 페이지 컨테이너의 스타일을 라우트 메타 데이터를 기반으로 계산
const pageContainerStyles = computed(() => ({
  maxWidth: route.meta?.width || '1080px',
  margin: '0 auto',
}));

// 인증 다이얼로그 상태 관리
const authDialog = ref(false);
// 인증 다이얼로그를 열기 위한 함수
const openAuthDialog = () => (authDialog.value = true);
</script>
