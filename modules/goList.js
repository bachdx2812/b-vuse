import { ref } from "vue-demi";

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
 * @param {boolean} reflectUrl - Whether to reflect the URL with the query parameters.
 *
 * @returns {Object} - The state and actions for managing the list.
 *   @property {Ref<Array>} items - The list items.
 *   @property {Ref<Object>} metadata - The pagination metadata.
 *   @property {Ref<Object>} query - The current query object.
 *   @property {Ref<Object>} pagyInput - The pagination input.
 *   @property {Ref<any>} orderBy - The order by value.
 *   @property {Function} fetchList - Fetches the list from the server.
 *   @property {Function} search - Performs a search and updates the list.
 *   @property {Function} changePage - Changes the current page.
 *   @property {Function} reset - Resets the query and pagination.
 *   @property {Function} parseQueryAndFetch - Parses query params and fetches the list.
 *   @property {Ref<boolean>} fetching - Indicates if the list is being fetched.
 */
export default function useList({
  fetchListFnc,
  fetchKey,
  queryFormModels,
  route,
  router,
  perPage,
  extraParams,
  reflectUrl = true,
}) {
  const pagyInputDefault = { page: 1, perPage: perPage || 10 };

  const items = ref([]);
  const metadata = ref({});
  const query = ref({});
  const pagyInput = ref({ ...pagyInputDefault });
  const orderBy = ref(null);
  const searchedQuery = ref({});
  const fetching = ref(false);

  const fetchList = async () => {
    fetching.value = true;
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
    fetching.value = false;
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

  const reset = async ({ defaultQuery, defaultOrder }) => {
    query.value = {
      ...(defaultQuery ? new queryFormModels(defaultQuery) : {}),
      ...pagyInputDefault,
    };
    orderBy.value = defaultOrder;
    pagyInput.value = { ...pagyInputDefault };

    await search();
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
    return flattenQuery({ ...query.value, orderBy: orderBy.value });
  };

  const search = async () => {
    if (reflectUrl) {
      await router.replace({ query: toUrlParams() });
    }

    await parseQueryAndFetch(toUrlParams());
  };

  const changePage = async (pagy) => {
    query.value = { ...searchedQuery.value, page: pagy.page };
    await search();
  };

  const parseQueryAndFetch = async (queryParams) => {
    let params = parseQueryParams(route.query);
    if (!reflectUrl && queryParams) {
      params = parseQueryParams(queryParams);
    }

    pagyInput.value.page = params.page
      ? Number(params.page)
      : pagyInputDefault.page;

    pagyInput.value.perPage = params.perPage
      ? Number(params.perPage)
      : pagyInputDefault.perPage;

    query.value = queryFormModels ? new queryFormModels(params) : params;
    orderBy.value = route.query.orderBy || orderBy.value;
    searchedQuery.value = queryFormModels
      ? new queryFormModels(params)
      : params;

    await fetchList();
  };

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
    parseQueryAndFetch,
    fetching,
  };
}
