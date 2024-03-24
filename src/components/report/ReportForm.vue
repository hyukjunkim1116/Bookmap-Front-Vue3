<template>
  <!-- 로그인 폼의 메인 컨테이너 -->
  <q-dialog>
    <q-card :style="{ width: '400px' }">
      <q-card-section class="flex">
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="q-px-xl q-pb-xl">
        <div>
          <div class="text-h5 text-center text-weight-bold q-mb-xl">
            신고하기
          </div>
          <q-form class="q-gutter-y-md" @submit.prevent="handleReportPost">
            <q-input
              v-model="form.title"
              placeholder="제목을 입력하세요."
              outlined
              dense
            />
            <q-input
              v-model="form.content"
              type="textarea"
              placeholder="내용을 입력하세요."
              outlined
              dense
            />
            <div>
              <q-btn
                type="submit"
                label="제출하기"
                class="full-width"
                unelevated
                color="primary"
                :loading="isLoading"
              />
              <q-separator />
            </div>
          </q-form>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useAsyncState } from '@vueuse/core';
import { reportPost } from 'src/services';

import { useAuthStore } from 'src/stores/auth';
import { useRouter } from 'vue-router';
const props = defineProps({
  postId: {
    type: Number,
  },
});
const emit = defineEmits(['update:modelValue']);
const router = useRouter();
const $q = useQuasar();
const authStore = useAuthStore();
const { isLoading, error, execute } = useAsyncState(reportPost, null, {
  immediate: false,
  throwError: true,
  onSuccess: async () => {
    $q.notify('신고가 접수되었습니다. 빠른 시일 내 처리하겠습니다.');
    emit('update:modelValue', false);
  },
  onError: err => {
    console.log(err);
    $q.notify({
      type: 'negative',
      message: err.response.data.message,
    });
  },
});
const form = ref({
  title: '',
  content: '',
});
const handleReportPost = () => {
  execute(reportPost, props.postId, form.value);
};
</script>
<style lang="scss" scoped></style>
