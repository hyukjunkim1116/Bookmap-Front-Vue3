<template>
  <q-page class="imp-container imp-result q-pa-md">
    <q-icon v-if="success" name="check-circle" size="200px" color="positive" />
    <q-icon v-else name="exclamation-circle" size="200px" color="negative" />
    <h1 class="q-mt-md">
      {{ type === 'payment' ? '결제' : '본인인증' }}에
      {{ success ? '성공' : '실패' }}하였습니다
    </h1>
    <ul class="q-mb-md">
      <li v-if="impUid">
        <span>아임포트 번호:</span>
        <span>{{ impUid }}</span>
      </li>
      <li>
        <span>주문번호:</span>
        <span>{{ merchantUid }}</span>
      </li>
      <li v-if="!success && errorMessage">
        <span>에러 메시지:</span>
        <span>{{ errorMessage }}</span>
      </li>
    </ul>
    <q-btn size="lg" color="primary" @click="handleGoBack">뒤로가기</q-btn>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const type = ref(route.query.type);
const impUid = ref(route.query.imp_uid);
const merchantUid = ref(route.query.merchant_uid);
const errorMessage = ref(`${route.query.error_msg}`);
const success = ref(getSuccess(route.query));

function getSuccess(query) {
  console.log(query, 'query');
  const success = query.success;
  const impSuccess = query.imp_success;
  if (impSuccess === undefined) {
    if (typeof success === 'string') {
      return success === 'true';
    }
    return success;
  }
  if (typeof impSuccess === 'string') {
    return impSuccess === 'true';
  }
  return impSuccess;
}

function handleGoBack() {
  router.push(`/`);
}
</script>

<style scoped>
.imp-container.imp-result {
  .q-icon {
    margin-bottom: 20px;
  }
  ul {
    padding: 0;
    margin: 0 auto;
    width: 50%;
    li {
      text-align: left;
      list-style: none;
      font-size: 16px;
      display: flex;
      margin: 10px 0;
      span {
        display: inline-block;
      }
      span:first-child {
        width: 40%;
        color: #888;
      }
      span:last-child {
        width: 60%;
      }
    }
  }
  .q-btn {
    margin-top: 30px;
  }
}
</style>
