import { reactive } from "vue-demi";

import GoQueryInput from "../models/goQueryInput";

export default function useGoQuery({ page = 1, perPage = 10, query = {} }) {
  const goQueryInput = reactive(new GoQueryInput(page, perPage, query));

  function resetQuery() {
    goQueryInput.value = new GoQueryInput(page, perPage, q);
  }

  function updatePage(page) {
    goQueryInput.pagyInput.page = page;
  }

  function updatePerPage(perPage) {
    goQueryInput.pagyInput.perPage = perPage;
  }

  function updateQuery(query) {
    goQueryInput.query = query;
  }

  return {
    goQueryInput,

    updatePage,
    updatePerPage,
    updateQuery,
    resetQuery,
  };
}
