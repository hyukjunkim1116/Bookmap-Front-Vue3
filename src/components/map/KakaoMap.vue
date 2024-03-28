<template>
  <div id="map" class="q-mt-md"></div>
  <div class="button-group"></div>
</template>

<script setup>
//  길찾기, 큰지도 보기- 끝
import { getBookCrawling, getStoreSearch } from 'src/services';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
const props = defineProps({
  link: String, // 상위 컴포넌트로부터 전달받을 데이터의 타입을 지정합니다.
});
const route = useRoute();
let map = null;
let currentLatitude = null;
let currentLongitude = null;
const storeData = ref([]);
onMounted(() => {
  navigator.geolocation.getCurrentPosition(async position => {
    const isbn = route.params.isbn;
    currentLatitude = position.coords.latitude;
    currentLongitude = position.coords.longitude;
    const data = {
      isbn: isbn,
      currentLatitude: currentLatitude,
      currentLongitude: currentLongitude,
    };
    const response = await getBookCrawling(data);
    storeData.value = response.data;

    if (window.kakao && window.kakao.maps) {
      initMap();
    } else {
      const script = document.createElement('script');
      script.onload = () => kakao.maps.load(initMap);
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${
        import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY
      }`;
      document.head.appendChild(script);
    }
  });
});
const initMap = () => {
  const container = document.getElementById('map');
  const options = {
    center: new kakao.maps.LatLng(
      currentLatitude || 37.566826,
      currentLongitude || 126.9786567,
    ),
    level: 8,
  };
  map = new kakao.maps.Map(container, options);
  storeData.value.map(async store => {
    const storeName = `교보문고 ${store.store}점`;
    const response = await getStoreSearch(storeName);
    var markerPosition = new kakao.maps.LatLng(store.latitude, store.longitude);
    var marker = new kakao.maps.Marker({
      position: markerPosition,
    });
    marker.setMap(map);
    var iwContent = `
    <div style="padding:3px; text-align: center; font-size: small;">교보문고 ${store.store}점<br>재고 : ${store.count} <br>
      <a href="https://map.kakao.com/link/search/교보문고 ${store.store}점" style="color:blue" target="_blank">크게보기</a>
      <a href="https://map.kakao.com/link/to/${response.data.documents[0].id}" style="color:blue" target="_blank">길찾기</a>
      <a href="https://product.kyobobook.co.kr/detail/${store.code}" style="color:blue" target="_blank">구매하기</a>
    </div>
    `;
    var iwPosition = new kakao.maps.LatLng(currentLatitude, currentLongitude);
    var infowindow = new kakao.maps.InfoWindow({
      position: iwPosition,
      content: iwContent,
    });
    infowindow.open(map, marker);
  });
  displayCenterInfoWindow();
};
const displayCenterInfoWindow = () => {
  var markerPosition = new kakao.maps.LatLng(currentLatitude, currentLongitude);
  var marker = new kakao.maps.Marker({
    position: markerPosition,
  });
  marker.setMap(map);
  var cwContent = '<div style="padding:5px;">현재 위치 입니다.</div>';
  var cwPosition = new kakao.maps.LatLng(currentLatitude, currentLongitude);
  var cwRemoveable = true;
  var infowindow = new kakao.maps.InfoWindow({
    map,
    position: cwPosition,
    content: cwContent,
    removable: cwRemoveable,
  });
  infowindow.open(map, marker);
};
</script>
<style scoped>
#map {
  width: 800px;
  height: 800px;
}

.button-group {
  margin: 10px 0px;
}

button {
  margin: 0 3px;
}
</style>
