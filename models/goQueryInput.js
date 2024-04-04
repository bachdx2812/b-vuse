class PagyInput {
  constructor(page = 1, perPage = 10) {
    this.page = page;
    this.perPage = perPage;
  }
}

export default class GoQueryInput {
  constructor(page = 1, perPage = 10, query = {}) {
    this.pagyInput = new PagyInput(page, perPage);
    this.query = query; // for searching purpose
  }
}
