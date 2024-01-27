<template>
  <q-form @submit.prevent="handleSubmit">
    <q-card-section class="q-gutter-y-sm">
      <q-input
        v-model="titleModel"
        outlined
        placeholder="제목"
        counter
        :rules="[validateRequired]"
        maxlength="40"
      />

      <TiptapEditor v-model="contentModel" />
    </q-card-section>
    <q-separator />
    <q-card-actions align="right">
      <slot name="actions">
        <q-btn flat label="취소하기" v-close-popup />
        <q-btn
          type="submit"
          flat
          label="저장하기"
          color="primary"
          :loading="loading"
        />
      </slot>
    </q-card-actions>
  </q-form>
</template>

<script setup>
import { ref, computed, toRef } from 'vue';
import { useQuasar } from 'quasar';
import { validateRequired } from 'src/utils/validate-rules';
import TiptapEditor from 'src/components/tiptap/TiptapEditor.vue';

const props = defineProps({
  title: {
    type: String,
  },

  content: {
    type: String,
  },

  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:title', 'update:content', 'submit']);

const $q = useQuasar();

const titleModel = computed({
  get: () => props.title,
  set: val => emit('update:title', val),
});

const contentModel = computed({
  get: () => props.content,
  set: val => emit('update:content', val),
});

const handleSubmit = () => {
  if (!contentModel.value) {
    $q.notify('내용을 작성하세요.');
    return;
  }
  emit('submit');
};
</script>

<style lang="scss" scoped></style>
