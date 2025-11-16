export default class View {
  _data;

  render(data) {
    this._data = data;

    if (Array.isArray(data) && data.length == 0) return this.renderMessage();

    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderSpinner() {
    const markup = `
         <div class="spinner">
            <img src="/loader.svg" alt="spinner" />
        </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderMessage(message = this._message) {
    this._clear();
    this._parentElement.insertAdjacentHTML(
      "afterbegin",
      `<p class="message">${message}</p>`
    );
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }
}
