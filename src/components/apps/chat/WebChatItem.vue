<template>
  <q-item class="q-py-md" v-if="!isYou">
    <q-item-section side top>
      <q-avatar size="md">
        <img :src="sender_image || generateDefaultPhotoURL(sender_id)" />
      </q-avatar>
    </q-item-section>
    <q-item-section>
      <div class="flex text-caption">
        <span>{{ sender }}</span>
        <span class="q-mx-xs">&middot;</span>
        <span class="text-grey-6">{{
          date.formatDate(timestamp, 'YYYY. MM. DD HH:mm:ss')
        }}</span>
      </div>
      <div class="q-mt-sm">
        {{ content }}
      </div>
    </q-item-section>
  </q-item>

  <q-item class="q-py-md justify-end" v-else>
    <q-item-section side>
      <div class="flex text-caption">
        <span class="text-grey-6">{{
          date.formatDate(timestamp, 'YYYY. MM. DD HH:mm:ss')
        }}</span>
        <span class="q-mx-xs">&middot;</span>
        <span>{{ sender }}</span>
      </div>

      <div class="q-mt-sm">
        {{ content }}
      </div>
    </q-item-section>
    <q-item-section side>
      <q-avatar size="md">
        <img :src="sender_image || generateDefaultPhotoURL(sender_id)" />
      </q-avatar>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { computed } from 'vue';
import { date } from 'quasar';
import { useAuthStore } from 'src/stores/auth';
import { generateDefaultPhotoURL } from 'src/services';
const authStore = useAuthStore();
const props = defineProps({
  id: {
    type: Number,
  },
  sender: {
    type: String,
  },
  content: {
    type: String,
  },
  timestamp: {
    type: String,
  },
  sender_image: {
    type: String,
  },
  sender_id: {
    type: Number,
  },
});
const isYou = computed(() => {
  return authStore.loginUser.uid == props.sender_id;
});
</script>
<style lang="scss" scoped></style>
