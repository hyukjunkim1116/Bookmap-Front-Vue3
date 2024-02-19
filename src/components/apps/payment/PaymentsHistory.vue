<template>
  <q-item class="q-py-md">
    <q-item-section>
      <div class="flex text-caption">
        <span>{{ authStore.loginUser.username }}</span>
        <span class="q-mx-xs">&middot;</span>
        <span>{{ buyer }}</span>
        <span class="q-mx-xs">&middot;</span>
        <span class="text-grey-6">{{
          date.formatDate(updated_at, 'YYYY. MM. DD HH:mm:ss')
        }}</span>
      </div>
      <div class="q-mt-sm">{{ amount }} || {{ imp }} || {{ merchant }}</div>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { date } from 'quasar';
import { useAuthStore } from 'src/stores/auth';
const authStore = useAuthStore();
const props = defineProps({
  id: {
    type: Number,
  },
  amount: {
    type: String,
  },
  updated_at: {
    type: String,
  },
  buyer: {
    type: Number,
  },
  imp: {
    type: String,
  },
  merchant: {
    type: String,
  },
});
</script>
<style lang="scss" scoped></style>
