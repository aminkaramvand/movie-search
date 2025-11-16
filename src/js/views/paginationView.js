import View from "./View";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");

  addHandlerPaginate(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".pagination__btn");
      if (!btn) return;

      const toPage = +btn.dataset.toPage;
      handler(toPage);
    });
  }

  _generateMarkup() {
    const total = this._data.totalResults;
    const page = this._data.page;
    const resPerPage = this._data.resultsPerPage;

    if (page === 1 && total <= page * resPerPage) return "";
    else if (page === 1)
      return `
        <button class="pagination__btn pagination__btn--decrease pagination__btn--hidden" data-to-page="${
          page - 1
        }">
          ⬅ Page
          <span class="to-page-number">${page - 1}</span>
        </button>
        <button class="pagination__btn pagination__btn--increase" data-to-page="${
          page + 1
        }">
          Page <span class="to-page-number">${page + 1}</span>
          ➡</span>
        </button>
    `;
    else if (total < page * resPerPage)
      return `
        <button class="pagination__btn pagination__btn--decrease " data-to-page="${
          page - 1
        }">
          ⬅ Page
          <span class="to-page-number">${page - 1}</span>
        </button>
        <button class="pagination__btn pagination__btn--increase pagination__btn--hidden" data-to-page="${
          page + 1
        }">
          Page <span class="to-page-number">${page + 1}</span>
         ➡
        </button>
    `;
    else
      return `
        <button class="pagination__btn pagination__btn--decrease" data-to-page="${
          page - 1
        }">
          ⬅ Page
          <span class="to-page-number">${page - 1}</span>
        </button>
        <button class="pagination__btn pagination__btn--increase" data-to-page="${
          page + 1
        }">
          Page <span class="to-page-number">${page + 1}</span>
         ➡
        </button>
    `;
  }

  clear() {
    this._clear();
  }
}

export default new PaginationView();
