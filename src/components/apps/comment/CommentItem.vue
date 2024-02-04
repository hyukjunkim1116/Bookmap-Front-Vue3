<template>
  <q-item class="q-py-md">
    <q-item-section side top>
      <q-avatar size="md">
        <img src="https://cdn.quasar.dev/img/avatar.png" />
      </q-avatar>
    </q-item-section>
    <q-item-section>
      <div class="flex text-caption">
        <span>{{ username }}</span>
        <span class="q-mx-xs">&middot;</span>
        <span class="text-grey-6">{{
          date.formatDate(created_at, 'YYYY. MM. DD HH:mm:ss')
        }}</span>
      </div>
      <div class="q-mt-sm" v-if="!isActive">
        {{ comment }}
      </div>
      <div class="q-mt-sm" v-if="isActive">
        <q-form @submit.prevent="handleEditComment">
          <q-input
            v-model="editedComment"
            type="textarea"
            outlined
            hide-bottom-space
            :rules="[validateRequired]"
          ></q-input>
          <div class="flex justify-end q-gutter-x-sm q-mt-sm">
            <q-btn label="취소" color="dark" unelevated @click="toggleActive" />
            <q-btn type="submit" label="수정" color="primary" unelevated />
          </div>
        </q-form>
      </div>
    </q-item-section>

    <q-btn
      v-if="authStore.hasOwnContent(author) && !isActive"
      icon="more_horiz"
      round
      flat
    >
      <q-menu>
        <q-list style="min-width: 100px">
          <q-item clickable v-close-popup @click="toggleActive">
            <q-item-section>수정하기</q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="$emit('delete', id)">
            <q-item-section>삭제하기</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </q-item>
</template>

<script setup>
import { ref } from 'vue';
import { date } from 'quasar';
import { useAuthStore } from 'src/stores/auth';
import { validateRequired } from 'src/utils/validate-rules';
const authStore = useAuthStore();
const emit = defineEmits(['edit', 'delete']);
const props = defineProps({
  id: {
    type: Number,
  },
  comment: {
    type: String,
  },
  created_at: {
    type: String,
  },
  author: {
    type: Number,
  },
  username: {
    type: String,
  },
});
const editedComment = ref(props.comment);
const isActive = ref(false);
const toggleActive = () => {
  if (!isActive.value && !authStore.isLogin) {
    $q.notify({
      type: 'negative',
      message: '로그인 후 이용 가능합니다.',
    });
    return;
  }
  isActive.value = !isActive.value;
};
const handleEditComment = () => {
  console.log('edit', props.id, editedComment.value);
  emit('edit', props.id, editedComment.value);
  toggleActive();
};
</script>
<style lang="scss" scoped></style>
