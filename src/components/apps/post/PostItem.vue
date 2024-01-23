<template>
  <q-item class="bg-white q-pt-md" clickable :to="`/posts/${item.id}`">
    <q-item-section avatar top>
      <q-skeleton v-if="isLoadingPostUser" type="circle" />
      <q-avatar v-else>
        <img :src="postUser?.photoURL" alt="" />
      </q-avatar>
    </q-item-section>
    <q-item-section class="post-content">
      <div class="flex items-center">
        <q-skeleton v-if="isLoadingPostUser" type="rect" width="40px" />
        <span v-else>{{ postUser?.displayName }}</span>
        <span class="q-mx-xs">&middot;</span>
      </div>
      <div class="text-h6 q-mt-sm">{{ item.title }}</div>
      <div v-if="escapeHTML" class="text-grey-6 q-my-sm ellipsis-2-lines">
        {{ item.content }}
      </div>
      <div
        v-else
        class="text-grey-6 q-my-sm ellipsis-2-lines"
        v-html="item.content"
      ></div>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { useAsyncState } from '@vueuse/core';
import { getUserById } from 'src/services';
const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
  escapeHTML: {
    type: Boolean,
    default: false,
  },
});
const { state: postUser, isLoading: isLoadingPostUser } = useAsyncState(
  () => getUserById(props.item.uid),
  console.log(props.item),
  {},
);
</script>
