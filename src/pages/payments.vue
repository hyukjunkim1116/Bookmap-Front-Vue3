<template>
  <q-page class="items-center column">
    <q-container class="q-gutter">
      <h1>아임포트 결제</h1>
      <q-form
        class="column justify-center"
        :formData="formData"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
        :colon="false"
        label-align="left"
        @submit="handleSubmit"
      >
        <div class="q-pa-md">
          <div class="q-gutter-y-md column" style="max-width: 800px">
            <q-select
              color="orange"
              filled
              v-model="formData.pg"
              :options="pgs"
              label="PG사 선택"
              @update:model-value="val => changePg(val)"
            >
              <template v-if="formData.pg" v-slot:append>
                <q-icon
                  name="cancel"
                  @click.stop.prevent="formData.pg = null"
                  class="cursor-pointer"
                />
              </template>
            </q-select>
          </div>
        </div>
        <div class="q-pa-md">
          <div class="q-gutter-y-md column" style="max-width: 300px">
            <q-select
              color="orange"
              filled
              v-model="formData.payMethod"
              :options="methods"
              label="결제수단"
              @update:model-value="val => changePayMethod(val)"
            >
              <template v-if="formData.payMethod" v-slot:append>
                <q-icon
                  name="cancel"
                  @click.stop.prevent="formData.payMethod = null"
                  class="cursor-pointer"
                />
              </template>
            </q-select>
          </div>
        </div>
        <div>
          <q-toggle
            v-model="formData.escrow"
            label="에스크로 결제여부"
            left-label
          />
        </div>
        <q-form-item label="입금기한" v-if="vbankDueVisible">
          <q-input
            v-model="formData.vbankDue"
            placeholder="YYYYMMDDhhmm"
            size="large"
            type="number"
            label="입금기한"
          />
        </q-form-item>

        <q-form-item label="사업자번호" v-if="bizNumVisible">
          <q-input
            v-model="formData.bizNum"
            size="large"
            type="number"
            label="사업자번호"
          />
        </q-form-item>

        <div class="q-pa-md" v-if="quotaVisible">
          <div class="q-gutter-y-md column" style="max-width: 300px">
            <q-select
              color="blue"
              filled
              v-model="formData.quota"
              :options="quotas"
              label="할부개월수"
              :display-value="
                formData.quota === '0'
                  ? 'PG사 기본제공'
                  : formData.quota === '1'
                  ? '일시불'
                  : `${formData.quota}개월`
              "
            >
              <template v-if="formData.quota" v-slot:append>
                <q-icon
                  name="cancel"
                  @click.stop.prevent="formData.quota = null"
                  class="cursor-pointer"
                />
              </template>
            </q-select>
          </div>
        </div>

        <q-form-item label="주문번호">
          <q-input
            v-model="formData.merchantUid"
            size="large"
            label="주문번호"
          />
        </q-form-item>

        <q-form-item label="주문명">
          <q-input v-model="formData.name" size="large" label="주문명" />
        </q-form-item>

        <q-form-item label="결제금액">
          <q-input
            v-model="formData.amount"
            size="large"
            type="number"
            label="결제금액"
          />
        </q-form-item>

        <q-form-item label="이름">
          <q-input v-model="formData.buyerName" size="large" label="이름" />
        </q-form-item>

        <q-form-item label="연락처">
          <q-input
            v-model="formData.buyerPhone"
            size="large"
            type="number"
            label="연락처"
          />
        </q-form-item>

        <q-form-item label="이메일">
          <q-input v-model="formData.buyerEmail" size="large" label="이메일" />
        </q-form-item>

        <q-form-item label="주소">
          <q-input v-model="formData.buyerAddr" size="large" label="주소" />
        </q-form-item>

        <q-form-item label="우편번호">
          <q-input
            label="우편번호"
            v-model="formData.buyerPostcode"
            size="large"
            type="number"
          />
        </q-form-item>
        <div class="flex justify-center items-center q-gutter-md q-mt-md">
          <q-btn size="large" @click="handleGoBack"> 뒤로가기 </q-btn>
          <q-btn type="submit" label="결제하기" size="large" />
        </div>
      </q-form>
    </q-container>
  </q-page>
</template>

<script setup>
import { PGS } from 'src/utils/payments/constants';
import Utils from 'src/utils/payments/util';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth';
import { useAsyncState } from '@vueuse/core';
import { payToPortOne } from 'src/services/payment';
import { useQuasar } from 'quasar';
const $q = useQuasar();
const authStore = useAuthStore();
const router = useRouter();
const methods = Utils.getMethodsByPg();
const pgs = PGS;
const initialMerchantUid = `mid_${new Date().getTime()}`;
const quotas = Utils.getQuotaByPg();
const vbankDueVisible = ref(false);
const bizNumVisible = ref(false);
const quotaVisible = ref(true);
const { execute, isLoading } = useAsyncState(payToPortOne, [], {
  immediate: false,
  throwError: true,
  onSuccess: response => {
    $q.notify({
      message: '결제완료',
    });
  },
  onError: err => {
    console.log(err);
    $q.notify({
      type: 'negative',
      message: getErrorMessage(err.response?.data),
    });
  },
});
const formData = ref({
  pg: '',
  payMethod: 'card',
  escrow: false,
  vbankDue: '20240301',
  bizNum: '11001',
  quota: '0',
  merchantUid: initialMerchantUid,
  name: '아임포트 VueJS 테스트 결제',
  amount: '100',
  buyerName: '홍길동',
  buyerPhone: '01012341234',
  buyerEmail: 'example@example.com',
  buyerAddr: '서울시 강남구 신사동 661-16',
  buyerPostcode: '06010',
});

const handleSubmit = e => {
  const values = formData.value;
  console.log(values);
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
    buyerPhone,
    buyerEmail,
    buyerAddr,
    buyerPostcode,
  } = values;
  const { IMP } = window;
  IMP.init(Utils.getUserCodeByPg(pg));
  const data = {
    pg: pg.value,
    pay_method: payMethod.value,
    escrow,
    merchant_uid: merchantUid,
    name,
    amount,
    buyer_name: buyerName,
    buyer_tel: buyerPhone,
    buyer_email: buyerEmail,
    buyer_addr: buyerAddr,
    buyer_postcode: buyerPostcode,
    niceMobileV2: true,
  };
  console.log(payMethod.value, pg.value, 'asdsad');
  if (payMethod.value === 'vbank') {
    data.vbank_due = vbankDue;
    if (pg.value === 'danal_tpay') {
      data.biz_num = bizNum;
    }
  }
  if (payMethod.value === 'card') {
    data.display = {
      card_quota: quota,
    };
  }
  IMP.request_pay(data, callback);
};

const changePg = val => {
  const pg = val.value;
  const newMethods = Utils.getMethodsByPg(pg);
  const [{ value }] = newMethods;
  methods.value = Utils.getMethodsByPg(pg);
  formData.value.payMethod = value;
  console.log(formData.value.payMethod, value);
  console.log(pg, value);
  setVisible(pg, value);
};

const changePayMethod = val => {
  const method = val.value;
  const pg = formData.value.pg.value;
  console.log(pg, method, 'asdsad');
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

const callback = async response => {
  // 본인인증 종료 후 result 페이지로 이동
  console.log(response, 'response');
  const query = {
    ...response,
    type: 'payment',
  };
  if (response['success'] == true) {
    const data = {
      buyer: authStore.loginUser.uid,
      amount: response['paid_amount'],
      imp: response['imp_uid'],
      merchant: response['merchant_uid'],
    };
    execute(payToPortOne, data);
  }
  await router.push({ path: '/payments/result', query });
};
</script>
<route lang="yaml">
meta:
  requiresAuth: true
</route>
