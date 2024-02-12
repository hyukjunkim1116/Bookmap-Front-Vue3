<template>
  <q-page class="imp-container">
    <h1>아임포트 결제</h1>
    <q-form
      v-model="form"
      label-col="6"
      wrapper-col="18"
      :colon="false"
      label-align="left"
      @submit.prevent="handleSubmit"
    >
      <q-option-group
        :options="pgOptions"
        v-model="form.pg"
        @change="handlePg"
      />

      <q-separator class="q-my-md q-mr-md" vertical />

      <q-option-group
        :options="methodsOptions"
        v-model="form.payMethod"
        @change="handleMethod"
      />

      <!-- 나머지 폼 아이템들 -->
      <q-btn size="lg" @click="handleGoBack">뒤로가기</q-btn>
      <q-btn type="submit" color="primary" size="lg">결제하기</q-btn>
    </q-form>
  </q-page>
</template>

<script setup>
import { PGS } from 'src/utils/payments/constants';
import Utils from 'src/utils/payments/util';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const methods = Utils.getMethodsByPg();
console.log(methods);
const pgOptions = PGS;
const methodsOptions = Utils.getMethodsByPg();
const formLayout = 'horizontal';
const form = ref({ name: 'payment', pg: '', payMethod: '' });
const initialMerchantUid = `mid_${new Date().getTime()}`;
const pgs = PGS;
console.log(pgs, methods, 'pgs');
const quotas = Utils.getQuotaByPg();
const initialMethod = 'card';
const vbankDueVisible = ref(false);
const bizNumVisible = ref(false);
const quotaVisible = ref(true);
const handleSubmit = e => {
  console.log(form.value);
  form.value.validateFields((err, values) => {
    if (!err) {
      const {
        pg,
        payMethod,
        escrow,
        vbankDue,
        bizNum,
        quota,
        merchantUid,
        name,
        amount,
        buyerName,
        buyerTel,
        buyerEmail,
        buyerAddr,
        buyerPostcode,
      } = values;
      const { IMP } = window;
      IMP.init(Utils.getUserCodeByPg(pg));
      const data = {
        pg,
        pay_method: payMethod,
        escrow,
        merchant_uid: merchantUid,
        name,
        amount,
        buyer_name: buyerName,
        buyer_tel: buyerTel,
        buyer_email: buyerEmail,
        buyer_addr: buyerAddr,
        buyer_postcode: buyerPostcode,
        niceMobileV2: true,
      };

      if (payMethod === 'vbank') {
        data.vbank_due = vbankDue;
        if (pg === 'danal_tpay') {
          data.biz_num = bizNum;
        }
      }
      if (payMethod === 'card') {
        data.display = {
          card_quota: quota,
        };
      }
      IMP.request_pay(data, callback);
    }
  });
};

const handlePg = pg => {
  console.log(pg);
  const newMethods = Utils.getMethodsByPg(pg);
  const [{ value }] = newMethods;

  methods.value = Utils.getMethodsByPg(pg);
  form.value.setFieldsValue({
    payMethod: value,
  });

  setVisible(pg, value);
};

const handleMethod = method => {
  const pg = form.value.getFieldValue('pg');
  setVisible(pg, method);
};

const setVisible = (pg, method) => {
  // 가상계좌 입금기한 렌더링 여부
  vbankDueVisible.value = method === 'vbank';

  // 사업자 번호 렌더링 여부
  bizNumVisible.value = pg === 'danal_tpay' && vbankDueVisible.value;

  // 할부개월수 렌더링 여부
  quotaVisible.value = method === 'card';
};

const handleGoBack = () => {
  router.push('/');
};

const callback = response => {
  // 본인인증 종료 후 result 페이지로 이동
  const query = {
    ...response,
    type: 'payment',
  };
  router.push({ path: '/result', query });
};
</script>
