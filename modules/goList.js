import { ref, watch } from "vue-demi";

export default function useList(
  fetchListFnc,
  fetchKey,
  queryFormModels,
  route,
  router
) {
  const pagyInputDefault = { page: 1, perPage: 10 };

  const items = ref([]);
  const metadata = ref({});
  const query = ref({});
  const pagyInput = ref({ ...pagyInputDefault });

  const fetchList = async () => {
    const res = await fetchListFnc(pagyInput.value, query.value);

    items.value = res[fetchKey].collection;
    metadata.value = res[fetchKey].metadata;
  };

  const flattenQuery = (obj, parent = "", res = {}) => {
    for (let key in obj) {
      let propName = parent ? `${parent}[${key}]` : key;
      if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
        flattenQuery(obj[key], propName, res);
      } else {
        res[propName] = obj[key];
      }
    }

    // To change query string on params every time
    res["z"] = Date.now();

    return res;
  };

  const reset = () => {
    query.value = new queryFormModels({});
    pagyInput.value = { ...pagyInputDefault };
  };

  const parseQueryParams = (query) => {
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
  };

  const toUrlParams = () => {
    return flattenQuery(query.value);
  };

  const search = () => {
    router.replace({ query: toUrlParams() });
  };

  const changePage = (pagy) => {
    const params = parseQueryParams(route.query);
    query.value = { ...params, page: pagy.page };
    router.replace({ query: toUrlParams() });
  };

  watch(
    () => route.query,
    (routeQuery) => {
      const params = parseQueryParams(routeQuery);

      pagyInput.value.page = params.page
        ? Number(params.page)
        : pagyInputDefault.page;

      pagyInput.value.perPage = params.perPage
        ? Number(params.perPage)
        : pagyInputDefault.perPage;

      query.value = new queryFormModels(params);

      fetchList();
    },
    { immediate: true, deep: true }
  );

  return {
    items,
    metadata,
    query,
    pagyInput,

    fetchList,
    search,
    changePage,
    reset,
  };
}
