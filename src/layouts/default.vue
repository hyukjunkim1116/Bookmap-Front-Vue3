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
          <q-toolbar-title> BookMap </q-toolbar-title>
        </q-btn>
        <!-- 툴바 우측 공간 -->
        <q-space />

        <!-- 로그인/회원가입 버튼 -->
        <q-separator class="q-my-md q-mr-md" vertical />
        <q-btn
          v-if="!authStore.isLogin"
          unelevated
          rounded
          color="primary"
          label="로그인 / 회원가입"
          @click="openAuthDialog"
        />
        <span v-if="authStore.isLogin">{{ displayName }}님 안녕하세요!</span>
        <!-- 사용자 프로필 및 메뉴 -->
        <q-btn v-if="authStore.isLogin" round flat class="q-ml-md">
          <q-avatar>
            <img
              :src="
                userImage || generateDefaultPhotoURL(authStore.loginUser?.uid)
              "
            />
          </q-avatar>

          <q-menu>
            <q-list style="min-width: 100px">
              <q-item
                v-if="authStore.loginUser.emailVerified"
                clickable
                v-close-popup
                to="/mypage/profile"
              >
                <q-item-section>프로필</q-item-section>
              </q-item>
              <q-item v-else clickable v-close-popup>
                <q-item-section class="text-red" @click="verifyEmail"
                  >이메일을 인증해주세요.</q-item-section
                >
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
        <q-btn
          v-if="authStore.isLogin"
          round
          flat
          class="q-ml-md"
          :icon="
            !isNotificationsRead ? 'notifications_active' : 'notifications'
          "
        >
          <NotificationList @isread="isReadDataFromChild" />
        </q-btn>
      </q-toolbar>
    </q-header>
    <q-page-container :style="pageContainerStyles">
      <router-view />
    </q-page-container>
    <AuthDialog v-model="authDialog" />
  </q-layout>
</template>
<script setup>
import { useQuasar } from 'quasar';
import { computed, onMounted, ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import {
  logout,
  generateDefaultPhotoURL,
  sendVerificationEmail,
  getBooks,
} from 'src/services';
import { useNotification, useWebChat } from 'src/services';
import { useAuthStore } from 'src/stores/auth';
import AuthDialog from 'src/components/auth/AuthDialog.vue';
import NotificationList from 'src/components/apps/chat/NotificationList.vue';

const $q = useQuasar();
const route = useRoute();
const authStore = useAuthStore();
const authDialog = ref(false);
const openAuthDialog = () => (authDialog.value = true);
const displayName = ref('');
const userImage = ref('');
const isNotificationsRead = ref(true);
const pageContainerStyles = computed(() => ({
  maxWidth: route.meta?.width || '1080px',
  margin: '0 auto',
}));
const isReadDataFromChild = bool => {
  isNotificationsRead.value = bool;
};
const handleLogout = async () => {
  const notifications = useNotification();
  const webSocket = useWebChat();
  notifications.close();
  webSocket.close();
  await logout();
  authStore.setAuthentication(false);
  $q.notify('로그아웃 되었습니다.');
};
const verifyEmail = async () => {
  await sendVerificationEmail(authStore.loginUser.uid);
  $q.notify('이메일을 확인해주세요!');
};
const darkModeIcon = computed(() =>
  $q.dark.isActive ? 'dark_mode' : 'light_mode',
);
const toggleDarkMode = () => {
  $q.dark.toggle();
  $q.localStorage.set('darkMode', $q.dark.isActive);
};
watchEffect(() => {
  displayName.value = authStore.loginUser?.username;
  userImage.value = authStore.loginUser?.image;
});
</script>
