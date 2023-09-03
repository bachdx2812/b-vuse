export default class QueryInput {
  constructor(page = 1, perPage = 10) {
    this.page = page;
    this.perPage = perPage;
    this.q = {}; // for searching purpose
  }
}
