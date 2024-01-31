<template>
  <q-item class="bg-white q-pt-md" clickable :to="`/posts/${item.id}`">
    <q-item-section avatar top>
      <q-avatar>
        <img src="https://cdn.quasar.dev/img/avatar.png" />
      </q-avatar>
    </q-item-section>
    <q-item-section class="post-content">
      <div class="flex items-center">
        <span>{{ item.author.username }}</span>
        <span class="q-mx-xs">&middot;</span>
        <span>{{ formatRelativeTime(new Date(item?.updated_at)) }}</span>
      </div>
      <div class="text-h6 q-mt-sm">{{ item.title }}</div>
      <div v-if="escapeHTML" class="text-grey-6 q-my-sm ellipsis-2-lines">
        {{ item.title }}
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
import { formatRelativeTime } from 'src/utils/relative-time-format';
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
</script>
