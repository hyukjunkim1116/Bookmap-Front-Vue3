<template>
  <q-item flat bordered class="flex column justify-center items-center q-mt-md">
    <q-img :src="book.image" width="20%" height="auto" />
    <q-card-section>
      <div class="row no-wrap items-center">
        <div class="col text-h6 ellipsis">{{ book.title }}</div>
      </div>
    </q-card-section>
    <q-card-section class="q-pt-none flex column justify-center items-center">
      <div class="text-subtitle1 q-mt-sm">{{ book.author }}</div>
      <div class="text-caption text-grey q-mt-sm">
        {{ book.description }}
      </div>
      <div class="text-caption text-grey q-mt-sm">
        {{ book.discount }}
      </div>
      <div class="text-caption text-grey q-mt-sm">
        {{ book.isbn }}
      </div>
      <div class="text-caption text-grey q-mt-sm">
        {{ book.link }}
      </div>
      <div class="text-caption text-grey q-mt-sm">
        {{ book.pubdate }}
      </div>
      <div class="text-caption text-grey q-mt-sm">
        {{ book.publisher }}
      </div>
    </q-card-section>
  </q-item>
  <div class="flex column justify-center items-center">
    <div class="text-h5 q-mt-md">매장 찾기</div>
    <KakaoMap :link="book.link" />
  </div>
</template>

<script setup>
import KakaoMap from 'src/components/map/KakaoMap.vue';
import { ref, onMounted } from 'vue';
import { useAsyncState } from '@vueuse/core';

import { getBookDetail } from 'src/services';
import { useQuasar } from 'quasar';
import { useRoute } from 'vue-router';

const route = useRoute();
const $q = useQuasar();
const book = ref([]);

const { execute } = useAsyncState(getBookDetail, [], {
  immediate: false,
  throwError: true,
  onSuccess: response => {
    book.value = response.data.items[0];
    console.log(response.data.items);
  },
  onError: err => {
    console.log(err);
    $q.notify({
      type: 'negative',
      message: getErrorMessage(err.response?.data),
    });
  },
});
onMounted(() => {
  const isbn = route.params.isbn;
  execute(getBookDetail, isbn);
});
</script>
<style lang="scss" scoped></style>
