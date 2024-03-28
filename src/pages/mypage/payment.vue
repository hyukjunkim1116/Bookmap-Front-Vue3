<template>
  <BaseCard>
    <PaymentsHistory
      v-for="item in items"
      :key="item.id"
      v-bind="item"
      escapeHTML
    />
  </BaseCard>
</template>

<script setup>
import PaymentsHistory from 'src/components/apps/payment/PaymentsHistory.vue';
import { useQuasar } from 'quasar';

import { getPaymentsHistory } from 'src/services';
import { useAsyncState } from '@vueuse/core';
import BaseCard from 'src/components/base/BaseCard.vue';
import { ref, onMounted } from 'vue';
const $q = useQuasar();
const items = ref([]);
const { execute, isLoading } = useAsyncState(getPaymentsHistory, [], {
  immediate: false,
  throwError: true,
  onSuccess: response => {
    items.value = response.data;
  },
  onError: err => {
    $q.notify({
      type: 'negative',
      message: err.response.data.message,
    });
  },
});
onMounted(() => {
  execute();
});
</script>

<style lang="scss" scoped></style>
