import { ref, watch } from "vue-demi";

/**
 * Custom hook to manage and fetch a paginated list.
 *
 * @param {Function} fetchListFnc - The function to fetch the list data.
 * @param {string} fetchKey - The main key that return from server, used for fetching the list.
 * @param {Object} queryFormModels - The query form models for filtering the list. This will be push to server. Can be Null
 * @param {string} route - The `route` object of `vue-router`.
 * @param {Object} router - The `router` object of `vue-router`.
 * @param {number} [perPage=10] - The number of items per page.
 *
 * @returns {Object} - The state and actions for managing the list.
 */
export default function useList(
  fetchListFnc,
  fetchKey,
  queryFormModels,
  route,
  router,
  perPage = 10
) {
  const pagyInputDefault = { page: 1, perPage: perPage };

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

      query.value = queryFormModels ? new queryFormModels(params) : params;

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
