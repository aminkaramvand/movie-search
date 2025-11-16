import { PERSON_BASE_URL, IMAGE_BASE_URL } from "../config";
import placeholder from "../../assets/img/no-poster.jpg";
import View from "./View";

class MovieView extends View {
  _parentElement = document.querySelector(".movie-container");
  _message = "";
  #overlay = document.querySelector(".overlay");

  addHandlerRender(handler) {
    ["hashchange", "load"].forEach((event) =>
      window.addEventListener(event, handler)
    );
  }

  addHandlerWatchlist(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".add__btn");
      if (!btn) return;
      handler();
    });
  }

  addHandlerCloseModal(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".close-modal__btn");
      if (!btn) return;
      handler();
    });

    this.#overlay.addEventListener("click", handler);
  }

  _generateMarkup() {
    return `
        <button class="close-modal__btn hidden">×</button>
        <div class="movie__info">
           <h2 class="movie__title">${this._data.title}</h2>
          <figure class="figure">
            <img class="figure__img ${
              this._data.posterPath ? "" : "figure__img--no-poster"
            }"
              src="${
                this._data.posterPath
                  ? IMAGE_BASE_URL + this._data.posterPath
                  : `${placeholder}`
              }"
              alt="${this._data.title.slice(0, 10)}"
            />
            ${
              this._data.tagline !== ""
                ? `<figcaption class="tagline">${this._data.tagline}</figcaption>`
                : ""
            }
          </figure>
          <div class="details">
            <p class="details__genres"><span>Genre</span>: ${
              this._data.genres.length
                ? this._data.genres.map((gen) => gen.name).join(", ")
                : "_"
            }</p>
            <p class="details__language"><span>Language:</span> ${
              this._data.language ? this._data.language : "_"
            } ${
      this._data.languageInEng.length !== 0
        ? `(${
            this._data.languageInEng.find(
              (lan) => lan?.iso_639_1 === this._data.language
            )?.english_name
          })`
        : ""
    }</p>
            <p class="details__runtime"><span>Time:</span> ${
              this._data.runtime ? this._data.runtime + " min" : "_"
            }</p>
            <p class="details__vote"><span>Rate:</span> ${
              this._data.voteAverage ? this._data.voteAverage + " ⭐" : "_"
            }</p>
            <p class="details__release"><span>Release date:</span> ${
              this._data.releaseDate ? this._data.releaseDate : "_"
            }</p>
            <p class="details__budget"><span>Budget:</span> ${
              this._data.budget
                ? "$" + this.#convertToMillion(this._data.budget)
                : "_"
            }</p>
            ${
              this._data.trailer
                ? `<a class="details__trailer" href="https://www.youtube.com/embed/${this._data.trailer.key}" target="_blank">Watch Trailer</a>`
                : ""
            }
          </div>
        </div>
        <div class="movie__overview">
          <h4>
           <span>Overview:</span> ${
             this._data.overview ? this._data.overview : "_"
           }
          </h4>
          <div class="movie__casts-container"><span>Casts: </span>
           <p class="movie__casts-names">${
             this._data.casts.length
               ? this._data.casts
                   .map(
                     (cast) =>
                       `<a class="movie__cast" href="${PERSON_BASE_URL}/${cast.id}" target="_blank">
                  ${cast.name}</a>`
                   )
                   .join(", ")
               : "_"
           } </p>
          </div>
          <div class="movie__director-container"><span>Director: </span>
            ${
              this._data.director.name
                ? `<a class="movie__director" href="${PERSON_BASE_URL}/${this._data.director.id}" target="_blank">
            ${this._data.director.name}
            </a>`
                : "_"
            }
          </div>
        </div>
        <button class="add__btn">${
          this._data.watchlist ? "Remove from" : "Add to"
        } watchlist</button>`;
  }

  #convertToMillion(value) {
    const valueInM = value / 1000000;
    return valueInM < 1 ? value : valueInM.toFixed(2) + "M";
  }

  updateAddBtn() {
    this._parentElement.querySelector(".add__btn").innerHTML = ` ${
      this._data.watchlist ? "Remove from" : "Add to"
    } watchlist`;
  }

  //  Modal movie for mobile screen sizes
  closeModal() {
    this._parentElement.classList.remove("open");
    this.#overlay.classList.add("hidden");
  }

  openModal() {
    this._parentElement.classList.add("open");
    this.#overlay.classList.remove("hidden");
  }
}

export default new MovieView();
