import { reactive } from "vue-demi";

import GoQueryInput from "../models/goQueryInput";

export default function useGoQuery({ page = 1, perPage = 10, query = {} }) {
  const goQueryInput = reactive(new GoQueryInput(page, perPage, query));

  function resetQuery(callback = null) {
    goQueryInput.value = new GoQueryInput(page, perPage, query);

    if (callback != null) {
      callback();
    }
  }

  function updatePage(page, callback = null) {
    goQueryInput.pagyInput.page = page;

    if (callback != null) {
      callback();
    }
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
