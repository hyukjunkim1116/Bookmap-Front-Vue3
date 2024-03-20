<template>
  <q-item
    flat
    bordered
    clickable
    class="flex column justify-center items-center q-mt-md"
    :to="`/books/${book.isbn}`"
  >
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
</template>

<script setup>
import { useRouter } from 'vue-router';
const props = defineProps({
  book: {
    type: Object,
    default: () => ({}),
  },
  escapeHTML: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped></style>
