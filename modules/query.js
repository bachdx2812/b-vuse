import { ref } from "vue-demi";

import QueryInput from "../models/queryInput";

export default function useQuery() {
  const queryInput = ref(new QueryInput());

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
