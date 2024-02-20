<template>
  <q-menu>
    <q-list style="min-width: 200px">
      <q-item
        clickable
        v-for="notification in notifications.messages?.value"
        :key="notification.id"
      >
        <q-item-section
          :class="{ 'is-read': notification.is_read }"
          @click.prevent="handleNotification(notification, notification.id)"
          >{{ notification.message }} |
          {{
            date.formatDate(notification.created_at, 'YYYY. MM. DD HH:mm:ss')
          }}
        </q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script setup>
import { date } from 'quasar';
import { computed, watch } from 'vue';
import { putReadNotification, useNotification } from 'src/services';
const emit = defineEmits(['isread']);
const notifications = useNotification();
const isRead = computed(() => {
  return (
    notifications &&
    notifications.messages &&
    notifications.messages.value.every(notification => notification.is_read)
  );
});
const handleNotification = async (notification, notId) => {
  if (!notification.is_read) {
    await putReadNotification(notId);
    notification.is_read = true;
  }
};
watch(
  isRead,
  () => {
    emit('isread', isRead.value);
  },
  {
    deep: true,
    immediate: true,
  },
);
console.log('isread', isRead.value);
console.log('imported');
</script>
<style scoped>
.is-read {
  color: #9b9b9b;
}
</style>
