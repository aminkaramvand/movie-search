import View from "./View";

class SearchView extends View {
  #parentElement = document.querySelector(".form-search");

  addHandlerSearch(handler) {
    this.#parentElement.addEventListener("submit", (e) => {
      e.preventDefault();
      handler();
    });
  }

  getQuery() {
    return this.#parentElement.querySelector(".form-search__input").value;
  }
  clearInput() {
    this.#parentElement.querySelector(".form-search__input").value = "";
  }
  renderMessage() {}
}

export default new SearchView();
