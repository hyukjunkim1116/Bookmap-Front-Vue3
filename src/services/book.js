// axios 라이브러리 import
import { jwtApi } from 'src/boot/axios-config';
import axios from 'axios';
export async function getBooks(data) {
  const { start, query } = data;
  const result = await jwtApi.get(`books?start=${start}&query=${query}`);
  console.log(result);
  return result;
}
export async function getBookDetail(isbn) {
  const result = await jwtApi.get(`books/detail?isbn=${isbn}`);
  console.log(result);
  return result;
}
export async function getBookCrawling(data) {
  const result = await jwtApi.get(
    `books/crawling?isbn=${data.isbn}&currentLatitude=${data.currentLatitude}&currentLongitude=${data.currentLongitude}`,
  );
  console.log(result);
  return result;
}
export async function getStoreSearch(query) {
  const url = 'https://dapi.kakao.com/v2/local/search/keyword.json';

  try {
    // 요청을 보내고 응답을 반환합니다.
    const response = await axios.get(url, {
      params: { query: query },
      headers: {
        Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}`,
      },
    });

    // 응답을 반환합니다.
    return response;
  } catch (error) {
    // 에러가 발생하면 콘솔에 로그를 출력하고 에러를 반환합니다.
    console.error('Error fetching store search:', error);
    throw error;
  }
}
