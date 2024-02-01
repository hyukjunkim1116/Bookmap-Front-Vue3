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
      <div class="q-mt-sm">
        {{ comment }}
      </div>
    </q-item-section>
    <q-item-section v-if="authStore.hasOwnContent(author)" side top>
      <q-btn
        flat
        color="grey"
        icon="sym_o_delete"
        round
        dense
        @click="$emit('delete', id)"
      />
    </q-item-section>
  </q-item>
</template>

<script setup>
import { useAsyncState } from '@vueuse/core';
import { date } from 'quasar';
import { useAuthStore } from 'src/stores/auth';
const authStore = useAuthStore();

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
defineEmits(['delete']);
</script>
<style lang="scss" scoped></style>
