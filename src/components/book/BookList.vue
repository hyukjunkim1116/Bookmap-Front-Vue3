<template>
  <div class="row flex items-center justify-center q-mt-sm">
    <BookItem v-for="book in books" :key="book.isbn" :book="book" />
  </div>
</template>
<script setup>
import BookItem from './BookItem.vue';
defineProps({
  books: Array,
  default: () => [],
});
</script>
<style lang="scss" scoped></style>
