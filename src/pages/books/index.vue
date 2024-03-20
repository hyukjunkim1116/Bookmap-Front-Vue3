<template>
  <div class="flex column justify-center items-center">
    <div class="text-h3 q-mt-md">책 검색하기</div>
    <div class="q-mt-md">
      <q-form class="search-form">
        <q-input
          v-model="query"
          type="text"
          outlined
          hide-bottom-space
          class="search-input"
          placeholder="책 검색하기"
        ></q-input>
        <q-icon
          type="button"
          name="sym_o_search"
          class="search-icon"
          @click.prevent="bookSearch"
          @keydown.enter.prevent="bookSearch"
        >
          <q-tooltip :offset="[0, 5]">
            <div class="tooltip-content">검색</div>
          </q-tooltip>
        </q-icon>
      </q-form>
    </div>
  </div>
  <BookList :books="books" />
  <div v-intersection-observer="handleIntersectionObserver"></div>
</template>

<script setup>
import { vIntersectionObserver } from '@vueuse/components';
import { ref, onMounted } from 'vue';
import { useAsyncState } from '@vueuse/core';
import { getErrorMessage } from 'src/utils/error-message';
import { getBooks } from 'src/services';
import BookList from 'src/components/book/BookList.vue';
import { useQuasar } from 'quasar';
const $q = useQuasar();
const books = ref([]);
const start = ref(1);
const query = ref(null);
const isLoadMore = ref(true);
const { execute } = useAsyncState(getBooks, [], {
  immediate: false,
  throwError: true,
  onSuccess: response => {
    const roundedNumber = Math.round(response.data.total / 10) * 10;
    if (roundedNumber <= start.value + 10) {
      isLoadMore.value = false;
    }
    if (start.value >= 10) {
      books.value = books.value.concat(response.data.items);
    } else {
      books.value = response.data.items;
    }
    console.log(response.data);
    console.log(isLoadMore.value);
  },
  onError: err => {
    console.log(err);
    $q.notify({
      type: 'negative',
      message: getErrorMessage(err.response?.data),
    });
  },
});
const loadMore = () => {
  start.value += 10;
  execute(getBooks, { start: start.value, query: query.value });
  console.log('loadmore');
};
const handleIntersectionObserver = ([{ isIntersecting }]) => {
  if (isIntersecting && isLoadMore.value) {
    loadMore();
  }
};
const bookSearch = () => {
  start.value = 1;
  console.log(query.value);
  execute(getBooks, { start: start.value, query: query.value });
};
onMounted(() => {
  if (!query.value) {
    execute(getBooks, { start: start.value, query: query.value });
  }
});
</script>
<style lang="scss" scoped>
.search-form {
  display: flex;
  align-items: center;
  padding: 8px; /* 내부 여백 추가 */
  border-radius: 5px; /* 모서리 둥글게 만듦 */
}

.search-input {
  flex: 1;
  margin-right: 8px; /* 아이콘과 간격 추가 */
}

.tooltip-content {
  display: flex;
  align-items: center;
}

.search-icon {
  font-size: 40px; /* 아이콘 크기 설정 */
  cursor: pointer; /* 클릭 가능한 커서로 변경 */
}

/* 마우스 호버 시에 적용되는 스타일 */
.search-icon:hover {
  background-color: #ddd; /* 회색 배경 추가 */
}
</style>
