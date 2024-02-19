<template>
  <q-page class="imp-container">
    <q-card class="q-pa-md" style="max-width: 400px">
      <div class="text-h6">아임포트 본인인증</div>
      <q-form
        v-model="form"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 8 }"
        :colon="false"
        label-align="left"
        @submit="handleSubmit"
      >
        <q-input v-model="form.merchantUid" label="주문번호" outlined dense />
        <q-input v-model="form.company" label="회사명" outlined dense />
        <q-select
          color="blue"
          filled
          v-model="form.carrier"
          :options="carriers"
          label="통신사"
        />
        <q-input v-model="name" label="이름" outlined dense />
        <q-input
          v-model="form.phone"
          label="전화번호"
          type="number"
          outlined
          dense
        />
        <q-input
          v-model="form.minAge"
          label="허용최소연령"
          type="number"
          outlined
          dense
        />
        <div class="q-mt-md">
          <q-btn color="primary" label="본인인증" @click="handleSubmit" />
          <q-btn label="뒤로가기" @click="handleGoBack" flat dense />
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
const router = useRouter();
const form = ref({
  name: 'certification',
  merchantUid: '',
  company: '',
  carrier: '',
  phone: '',
  minAge: '',
});
const initialMerchantUid = `mid_${new Date().getTime()}`;
const carriers = [
  { label: 'SKT', value: 'SKT' },
  { label: 'KT', value: 'KTF' },
  { label: 'LGU+', value: 'LGT' },
  { label: '알뜰폰', value: 'MVNO' },
];

const handleSubmit = () => {
  const { merchantUid, company, carrier, name, phone, minAge } = form.value;
  const { IMP } = window;
  IMP.init('imp10391932');
  const data = {
    merchant_uid: merchantUid,
    company,
    carrier,
    name,
    phone,
    min_age: minAge,
  };
  IMP.certification(data, callback);
};

const handleGoBack = () => {
  router.push('/');
};

const callback = response => {
  const query = {
    ...response,
    type: 'certification',
  };
  router.push({ path: '/payments/result', query });
};

const merchantUid = ref(initialMerchantUid);
const company = ref('SIOT');
const carrier = ref('SKT');
const name = ref('');
const phone = ref('');
const minAge = ref('');
</script>

<style scoped>
.imp-container {
  padding: 20px;
}
</style>
