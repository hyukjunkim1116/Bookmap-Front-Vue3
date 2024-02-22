<template>
  <BaseCard>
    <PostList :items="items" escapeHTML />
  </BaseCard>
</template>

<script setup>
import PostList from 'src/components/apps/post/PostList.vue';
import { useQuasar } from 'quasar';
import { getErrorMessage } from 'src/utils/error-message';
import { getPosts } from 'src/services';
import { useAsyncState } from '@vueuse/core';
import BaseCard from 'src/components/base/BaseCard.vue';
import { ref, onMounted, computed } from 'vue';
const $q = useQuasar();
const items = ref([]);
const params = computed(() => ({
  sort: 'bookMark',
}));
const { execute, isLoading } = useAsyncState(getPosts, [], {
  immediate: false,
  throwError: true,
  onSuccess: response => {
    console.log(response.data, 'bookresdata');
    items.value = response?.data.results;
  },
  onError: err => {
    $q.notify({
      type: 'negative',
      message: getErrorMessage(err.response?.data),
    });
  },
});
onMounted(() => {
  execute(getPosts, params.value);
});
</script>

<style lang="scss" scoped></style>
