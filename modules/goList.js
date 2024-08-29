import { onMounted, ref } from "vue-demi";

/**
 * Custom hook to manage and fetch a paginated list.
 *
 * @param {Function} fetchListFnc - The function to fetch the list data.
 * @param {string} fetchKey - The main key that return from server, used for fetching the list.
 * @param {Object} queryFormModels - The query form models for filtering the list. This will be push to server. Can be Null
 * @param {string} route - The `route` object of `vue-router`.
 * @param {Object} router - The `router` object of `vue-router`.
 * @param {number} [perPage=10] - The number of items per page.
 * @param {Object} extraParams - The additional parameters for filtering the list. This will be push to server. Can be Null
 *
 * @returns {Object} - The state and actions for managing the list.
 */
export default function useList({
  fetchListFnc,
  fetchKey,
  queryFormModels,
  route,
  router,
  perPage,
  extraParams,
}) {
  const pagyInputDefault = { page: 1, perPage: perPage || 10 };

  const items = ref([]);
  const metadata = ref({});
  const query = ref({});
  const pagyInput = ref({ ...pagyInputDefault });
  const orderBy = ref(null);

  const fetchList = async () => {
    const params = {
      input: pagyInput.value,
      query: query.value,
      orderBy: orderBy.value,
      ...extraParams,
    };

    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value != null)
    );

    const res = await fetchListFnc(filteredParams);

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

  const search = async () => {
    await router.replace({ query: toUrlParams() });
    updateQueryAndFetch();
  };

  const changePage = async (pagy) => {
    const params = parseQueryParams(route.query);
    query.value = { ...params, page: pagy.page };
    await router.replace({ query: toUrlParams() });
    updateQueryAndFetch();
  };

  const updateQueryAndFetch = () => {
    const params = parseQueryParams(route.query);

    pagyInput.value.page = params.page
      ? Number(params.page)
      : pagyInputDefault.page;

    pagyInput.value.perPage = params.perPage
      ? Number(params.perPage)
      : pagyInputDefault.perPage;

    query.value = queryFormModels ? new queryFormModels(params) : params;

    fetchList();
  };

  onMounted(() => {
    updateQueryAndFetch();
  });

  return {
    items,
    metadata,
    query,
    pagyInput,
    orderBy,

    fetchList,
    search,
    changePage,
    reset,
  };
}
