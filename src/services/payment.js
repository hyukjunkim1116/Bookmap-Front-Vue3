import { jwtApi } from 'src/boot/axios-config';
export async function payToPortOne(data) {

  return await jwtApi.post(`payments/pay`, data);
}
export async function getPaymentsHistory() {
  
  return await jwtApi.get(`payments/pay`);
}
