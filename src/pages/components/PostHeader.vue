<template>
  <div class="flex items-center q-mb-lg">
    <div class="text-h5">전체</div>
    <q-space />
    <q-tabs
      :model-value="sort"
      @update:model-value="value => $emit('update:sort', value)"
      narrow-indicator
      dense
    >
      <q-tab :rapple="false" label="최신순" name="createdAt" />
      <q-tab :rapple="false" label="조회순" name="readCount" />
      <q-tab :rapple="false" label="좋아요순" name="likeCount" />
    </q-tabs>
  </div>
  <div class="q-mt-md">
    <q-form @submit.prevent="handleSearchPost" class="search-form">
      <q-input
        v-model="searchText"
        type="text"
        outlined
        hide-bottom-space
        class="search-input"
        placeholder="게시글 검색하기"
      ></q-input>
      <q-icon
        clickable
        name="sym_o_search"
        class="search-icon"
        @click="handleSearchPost"
      >
        <q-tooltip :offset="[0, 5]">
          <div class="tooltip-content">검색</div>
        </q-tooltip>
      </q-icon>
    </q-form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const searchText = ref('');
const emit = defineEmits(['search', 'update:sort']);
defineProps({
  sort: {
    type: String,
    default: 'createdAt',
  },
  search: {
    type: String,
  },
});
const handleSearchPost = () => {
  emit('search', searchText.value);
};
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
