import { jwtApi } from 'src/boot/axios-config';

export async function getChats() {
  console.log('asd');
  return await jwtApi.get('webchat/');
}
export async function getNotifications() {
  return await jwtApi.get('notification/');
}

export async function putReadNotification(notId) {
  return await jwtApi.patch(`notification/${notId}`);
}
