<template>
  <div class="imp-container">
    <h1>아임포트 본인인증</h1>
    <div
      :form="form"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
      :colon="false"
      labelAlign="left"
      @submit="handleSubmit"
    >
      <div label="주문번호">
        <input v-model="merchantUid" size="large" />
      </div>
      <div label="회사명">
        <input v-model="company" size="large" />
      </div>
      <div label="통신사">
        <a-select v-model="carrier" size="large">
          <a-select-option value="SKT"> SKT </a-select-option>
          <a-select-option value="KTF"> KT </a-select-option>
          <a-select-option value="LGT"> LGU+ </a-select-option>
          <a-select-option value="MVNO"> 알뜰폰 </a-select-option>
        </a-select>
      </div>
      <div label="이름">
        <input v-model="name" size="large" />
      </div>
      <div label="전화번호">
        <input v-model="phone" type="number" size="large" />
      </div>
      <div label="허용최소연령">
        <input v-model="minAge" type="number" size="large" />
      </div>
      <q-btn size="large" @click="handleGoBack"> 뒤로가기 </q-btn>
      <q-btn type="primary" html-type="submit" size="large"> 본인인증 </q-btn>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const form = useAntForm.createForm(this, { name: 'certification' });
const initialMerchantUid = `mid_${new Date().getTime()}`;

const handleSubmit = e => {
  e.preventDefault();
  form.value.validateFields((err, values) => {
    if (!err) {
      const { merchantUid, company, carrier, name, phone, minAge } = values;
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
    }
  });
};

const handleGoBack = () => {
  const router = useRouter();
  router.push('/');
};

const callback = response => {
  // 본인인증 종료 후 result 페이지로 이동
  const query = {
    ...response,
    type: 'certification',
  };
  const router = useRouter();
  router.push({ path: '/result', query });
};

const merchantUid = ref(initialMerchantUid);
const company = ref('SIOT');
const carrier = ref('SKT');
const name = ref('');
const phone = ref('');
const minAge = ref('');
</script>
