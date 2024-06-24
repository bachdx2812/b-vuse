import { ref, watch } from "vue-demi";
import { useQuery } from "./query";

export default function useList(
  fetchListFnc,
  resultKey = "",
  perPage = 10,
  route,
  router
) {
  const { queryInput, updateQuery } = useQuery({
    perPage: perPage,
  });

  const list = ref([]);
  const currentPage = ref(null);
  const metadata = ref({ page: currentPage.value });
  const router = useRouter();
  const route = useRoute();

  watch(currentPage, (page) => {
    updateQuery({ page: page });

    router.push({ query: toUrlParams() });

    fetchList();
  });

  watch(
    () => route.query,
    (query) => {
      const params = parseQueryParams(query);
      if (params.page) {
        currentPage.value = Number(params.page);
      } else {
        currentPage.value = 1;
      }

      updateQuery({
        page: Number(params.page),
        perPage: Number(params.perPage) || perPage,
        q: params.q || {},
      });
    },
    { immediate: true }
  );

  function fetchList() {
    fetchListFnc(queryInput.value).then((result) => {
      const data = result[resultKey];

      list.value = data.collection;
      metadata.value = data.metadata;
    });
  }

  function flattenQuery(obj, parent = "", res = {}) {
    for (let key in obj) {
      let propName = parent ? `${parent}[${key}]` : key;
      if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
        flattenQuery(obj[key], propName, res);
      } else {
        res[propName] = obj[key];
      }
    }
    return res;
  }

  function parseQueryParams(query) {
    const result = {};
    for (const key in query) {
      if (query.hasOwnProperty(key)) {
        if (key.includes("[") && key.includes("]")) {
          const keys = key.split(/\[|\]/).filter(Boolean);
          keys.reduce((acc, k, i) => {
            if (i === keys.length - 1) {
              acc[k] = query[key];
            } else {
              acc[k] = acc[k] || {};
            }
            return acc[k];
          }, result);
        } else {
          result[key] = query[key];
        }
      }
    }
    return result;
  }

  function toUrlParams() {
    return flattenQuery(queryInput.value);
  }

  function search() {
    router.push({ query: toUrlParams() });
    fetchList();
  }

  return {
    list,
    currentPage,
    metadata,
    queryInput,

    // methods
    fetchList,
    search,
  };
}
