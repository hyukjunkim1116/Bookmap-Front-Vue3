<template>
  <!-- Quasar 레이아웃 구성: 헤더, 페이지 컨테이너 및 인증 다이얼로그 포함 -->
  <q-layout view="lHh Lpr lff">
    <!-- 헤더 섹션 -->
    <q-header bordered>
      <q-toolbar>
        <!-- 로고 및 홈 링크 버튼 -->
        <q-btn flat dense to="/">
          <q-avatar>
            <img src="/logo.png" />
          </q-avatar>
          <q-toolbar-title> FoodMap </q-toolbar-title>
        </q-btn>
        <!-- 툴바 우측 공간 -->
        <q-space />

        <!-- 로그인/회원가입 버튼 -->
        <q-separator class="q-my-md q-mr-md" vertical />
        <q-btn
          v-if="!loginStore.isLogin"
          unelevated
          rounded
          color="primary"
          label="로그인 / 회원가입"
          @click="openAuthDialog"
        />
        <span v-if="loginStore.isLogin">{{ displayName }}님 안녕하세요!</span>
        <!-- 사용자 프로필 및 메뉴 -->
        <q-btn v-if="loginStore.isLogin" round flat class="q-ml-md">
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/avatar.png" />
          </q-avatar>

          <q-menu>
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup to="/mypage/profile">
                <q-item-section>프로필</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="handleLogout">
                <q-item-section>로그아웃</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <q-btn
          class="q-ml-md"
          flat
          round
          dense
          :icon="darkModeIcon"
          @click="toggleDarkMode"
        />
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
import { computed, ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { useLoginStore } from 'src/stores/isLogin';
import { useAuthStore } from 'src/stores/auth';
import AuthDialog from 'src/components/auth/AuthDialog.vue';
import { logout } from 'src/services';

const $q = useQuasar();
const route = useRoute();
const loginStore = useLoginStore();
const authStore = useAuthStore();
// 페이지 컨테이너의 스타일을 라우트 메타 데이터를 기반으로 계산
const pageContainerStyles = computed(() => ({
  maxWidth: route.meta?.width || '1080px',
  margin: '0 auto',
}));
// 인증 다이얼로그 상태 관리
const authDialog = ref(false);
// 인증 다이얼로그를 열기 위한 함수
const openAuthDialog = () => (authDialog.value = true);
const displayName = ref('');
const handleLogout = async () => {
  await logout();
  await loginStore.setAuthentication(false);
  $q.notify('로그아웃 되었습니다.');
};
const darkModeIcon = computed(() =>
  $q.dark.isActive ? 'dark_mode' : 'light_mode',
);
const toggleDarkMode = () => {
  $q.dark.toggle();
  $q.localStorage.set('darkMode', $q.dark.isActive);
};
console.log(loginStore.isLogin);
watchEffect(() => {
  displayName.value = authStore.user?.payload.username;
});
</script>
