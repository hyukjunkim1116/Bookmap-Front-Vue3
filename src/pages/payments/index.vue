<template>
  <q-page class="items-center column">
    <q-list class="q-gutter">
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
        <q-form label="입금기한" v-if="vbankDueVisible">
          <q-input
            v-model="formData.vbankDue"
            placeholder="YYYYMMDDhhmm"
            type="number"
            label="입금기한"
          />
        </q-form>

        <q-form label="사업자번호" v-if="bizNumVisible">
          <q-input v-model="formData.bizNum" type="number" label="사업자번호" />
        </q-form>

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

        <q-form label="주문번호">
          <q-input v-model="formData.merchantUid" label="주문번호" />
        </q-form>

        <q-form label="주문명">
          <q-input v-model="formData.name" label="주문명" />
        </q-form>

        <q-form label="결제금액">
          <q-input v-model="formData.amount" type="number" label="결제금액" />
        </q-form>

        <q-form label="이름">
          <q-input v-model="formData.buyerName" label="이름" />
        </q-form>

        <q-form label="연락처">
          <q-input v-model="formData.buyerPhone" type="number" label="연락처" />
        </q-form>

        <q-form label="이메일">
          <q-input v-model="formData.buyerEmail" label="이메일" />
        </q-form>

        <q-form label="주소">
          <q-input v-model="formData.buyerAddr" label="주소" />
        </q-form>

        <q-form label="우편번호">
          <q-input
            label="우편번호"
            v-model="formData.buyerPostcode"
            type="number"
          />
        </q-form>
        <div class="flex justify-center items-center q-gutter-md q-mt-md">
          <q-btn @click="handleGoBack"> 뒤로가기 </q-btn>
          <q-btn type="submit" label="결제하기" />
          <q-btn to="/payments/certification" label="인증하기" />
        </div>
      </q-form>
    </q-list>
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
    $q.notify({
      type: 'negative',
      message: err.response.data.message,
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

  setVisible(pg, value);
};

const changePayMethod = val => {
  const method = val.value;
  const pg = formData.value.pg.value;

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
  router.push({ path: '/payments/result', query });
};
</script>
<route lang="yaml">
meta:
  requiresAuth: true
</route>
