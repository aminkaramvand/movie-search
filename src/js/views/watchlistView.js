import { IMAGE_BASE_URL } from "../config";
import View from "./View";

class Watchlist extends View {
  _parentElement = document.querySelector(".watchlist__list");
  _message = " ☹ No watchlist yet. Find a nice movie and bookmark it :)";

  addHandlerWatchlist(handler) {
    window.addEventListener("load", handler);
  }

  _generateMarkup() {
    return `
    ${this._data.map(this.#generateResultMarkup).join("\n")} 
    `;
  }

  #generateResultMarkup(result) {
    const id = +location.hash.slice(1);
    return `
              <li class="result watchlist__result ${
                result.id === id ? "link__active" : ""
              }" data-id="${result.id}">
                <a href="#${result.id}">
                  <img
                    class="result__img"
                    src="${IMAGE_BASE_URL + result.posterPath}.jpg"
                    alt="${result.title.slice(0, 10)} poster"
                  />
                  <h3 class="result__title">${result.title}</h3>
                  <div class="result__details">
                    <p class="result__vote">${result.voteAverage}⭐(${
      result.voteCount
    } votes)</p>
                    <p class="result__release">${result.releaseDate}</p>
                    <p class="result__adult">adult: <span>${
                      result.adult ? "yes" : "no"
                    }</span></p>
                  </div>
                </a>
              </li>`;
  }

  updateResults(id) {
    const lists = [...this._parentElement.children];
    lists.forEach((li) => li.classList.remove("link__active"));
    lists.find((li) => +li.dataset.id === id)?.classList.add("link__active");
  }
}

export default new Watchlist();
