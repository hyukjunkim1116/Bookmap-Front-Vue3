<template>
  <!-- 고정된 사이드바 컨테이너. 내부에 슬롯을 사용하여 다른 컴포넌트 또는 HTML을 삽입할 수 있음 -->
  <aside class="sticky-side-bar">
    <slot></slot>
  </aside>
</template>

<script setup></script>

<style lang="scss" scoped>
/* 사이드바를 화면에 고정시키기 위한 스타일. 스크롤 가능하고, 상단에 고정됨 */
.sticky-side-bar {
  position: sticky; /* 고정 위치 */
  top: 66px; /* 상단에서의 위치 */
  z-index: 2; /* z-index로 다른 요소 위에 오도록 설정 */
  overflow-y: scroll; /* 세로 스크롤 활성화 */
  height: fit-content !important; /* 내용에 맞게 높이 설정 */
}
</style>
