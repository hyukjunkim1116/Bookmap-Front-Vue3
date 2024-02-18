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
          :icon="isRead ? 'notifications' : 'notifications_active'"
        >
          <q-menu>
            <q-list style="min-width: 200px">
              <q-item
                clickable
                v-for="notification in notifications.messages.value"
                :key="notification.id"
              >
                <q-item-section
                  :class="{ 'is-read': notification.is_read }"
                  @click.prevent="
                    handleNotification(notification, notification.id)
                  "
                  >{{ notification.message }} |
                  {{
                    date.formatDate(
                      notification.created_at,
                      'YYYY. MM. DD HH:mm:ss',
                    )
                  }}
                  | {{ notification.is_read }}</q-item-section
                >
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
import { date } from 'quasar';
import { useNotification } from 'src/composables/useNotification';
import { computed, ref, watchEffect, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { useWebChat } from 'src/composables/useWebChat';
import { useAuthStore } from 'src/stores/auth';
import {
  logout,
  generateDefaultPhotoURL,
  sendVerificationEmail,
  putReadNotification,
} from 'src/services';
import AuthDialog from 'src/components/auth/AuthDialog.vue';
const pageContainerStyles = computed(() => ({
  maxWidth: route.meta?.width || '1080px',
  margin: '0 auto',
}));

const isLogin = ref(false);
const $q = useQuasar();
const route = useRoute();
const authStore = useAuthStore();
const uid = computed(() => {
  return authStore.loginUser?.uid || null;
});
const notifications = useNotification(uid.value);
const webSocket = useWebChat(uid.value);
const authDialog = ref(false);
const isRead = computed(() => {
  return notifications.messages?.value.every(
    notification => notification.is_read,
  );
});
const openAuthDialog = () => (authDialog.value = true);
const displayName = ref('');
const userImage = ref('');
const handleLogout = async () => {
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
const handleNotification = (notification, notId) => {
  if (!notification.is_read) {
    console.log('handleNot');
    putReadNotification(notId);
    notification.is_read = true;
  }
};
watchEffect(() => {
  displayName.value = authStore.loginUser?.username;
  userImage.value = authStore.loginUser?.image;
  isLogin.value = authStore.isLogin;
});
watch(
  isLogin,
  () => {
    if (isLogin.value) {
      notifications.open();
      webSocket.open();
    }
  },
  {
    deep: true,
    // immediate: true,
  },
);
</script>
<style scoped>
.is-read {
  color: #9b9b9b; /* 회색 배경색 */
}
</style>
