import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export const usePostQuery = () => {
  const route = useRoute();
  const router = useRouter();
  const sort = computed({
    get: () => route.query.sort || 'createdAt',
    set: val => router.push({ query: { ...route.query, sort: val } }),
  });
  const search = computed({
    get: () => route.query.sort || 'createdAt',
    set: val => router.push({ query: { ...route.query, sort: val } }),
  });
  return {
    sort,
    search,
  };
};
