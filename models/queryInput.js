export default class QueryInput {
  constructor(page = 1, perPage = 10, q = {}) {
    this.page = page;
    this.perPage = perPage;
    this.q = q; // for searching purpose
  }
}
