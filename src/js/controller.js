import "../styles/main.css";

import * as model from "./model";

import searchView from "./views/searchView";
import resultsView from "./views/resultsView";
import movieView from "./views/movieView";
import paginationView from "./views/paginationView";
import watchlistView from "./views/watchlistView";

const controlResults = async function () {
  try {
    const query = searchView.getQuery();

    searchView.clearInput();
    if (!query) return resultsView.renderMessage("Input can't be empty! 😐");

    resultsView.renderSpinner();

    paginationView.clear();

    await model.loadResults(query);

    resultsView.render(await model.getSearchResultsPage());

    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderMessage(err.message);
  }
};

const controlMovie = async function () {
  try {
    const id = location.hash.slice(1);
    if (!id) return;

    resultsView.updateResults(+id);
    watchlistView.updateResults(+id);

    // Mobile Layout
    if (window.matchMedia("(max-width: 450px)").matches) movieView.openModal();

    movieView.renderSpinner();

    await model.loadMovie(id);

    movieView.render(model.state.movie);
  } catch (err) {
    movieView.renderMessage(err.message);
  }
};

const controlPagination = async function (page) {
  try {
    paginationView.clear();

    resultsView.renderSpinner();

    resultsView.render(await model.getSearchResultsPage(page));

    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderMessage(err.message);
  }
};

const controlWatchlist = function () {
  watchlistView.render(model.state.watchlist);
};

const controlAddWatchlist = function () {
  // Add/Remove movie to/from watchlist
  if (model.state.movie.watchlist)
    model.removeFromWatchlist(model.state.movie.id);
  else model.AddToWatchlist(model.state.movie);

  movieView.updateAddBtn();

  watchlistView.render(model.state.watchlist);
};

// MOBOILE LAYOUT DISPLAY MOVIE
const controlCloseMovieModal = function () {
  movieView.closeModal();

  location.hash = "";
};

const init = function () {
  // Publisher-Subscriber pattern
  searchView.addHandlerSearch(controlResults);
  movieView.addHandlerRender(controlMovie);
  movieView.addHandlerWatchlist(controlAddWatchlist);
  movieView.addHandlerCloseModal(controlCloseMovieModal);
  paginationView.addHandlerPaginate(controlPagination);
  watchlistView.addHandlerWatchlist(controlWatchlist);

  // Mobile Layout
  if (window.matchMedia("(max-width: 450px)").matches)
    resultsView.renderMessage("😉 Start by searching for a movie. Have fun!");
};
init();

const clearStorage = function () {
  localStorage.clear();
};
window.clearStorage = clearStorage;
