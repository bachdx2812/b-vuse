import { ref } from "vue-demi";

import QueryInput from "../models/queryInput";

export default function useQuery(page = 1, perPage = 10, q = {}) {
  const queryInput = ref(new QueryInput(page, perPage, q));

  function resetQuery() {
    queryInput.value = new QueryInput();
  }

  function updateQuery(payload) {
    queryInput.value = { ...queryInput.value, ...payload };
  }

  return {
    queryInput,

    resetQuery,
    updateQuery,
  };
}
