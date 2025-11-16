import { BASE_URL, RES_PER_PAGE } from "./config";
import { getJSON } from "./helper";

export const state = {
  movie: {},
  search: { query: "", results: [], page: 1, resultsPerPage: RES_PER_PAGE },
  watchlist: [],
};

export const loadResults = async function (query, page = 1) {
  try {
    const data = await getJSON(
      `${BASE_URL}search/movie?query=${encodeURIComponent(
        query
      )}&page=${Math.ceil(page / 2)}`
    );

    const results = data.results.map((movie) => ({
      id: movie.id,
      adult: movie.adult,
      backdropPath: movie.backdrop_path,
      posterPath: movie.poster_path,
      title: movie.title,
      releaseDate: movie.release_date,
      voteAverage: movie.vote_average,
      voteCount: movie.vote_count,
    }));

    if (query === state.search.query && page > state.search.page)
      state.search.results = [...state.search.results, ...results];
    else state.search.results = results;

    state.search.totalResults = data.total_results;
    state.search.totalPages = Math.ceil(
      state.search.totalResults / RES_PER_PAGE
    );
    state.search.query = query;
  } catch (err) {
    throw err;
  }
};

export const loadMovie = async function (id) {
  try {
    const dataList = await getJSON([
      `${BASE_URL}movie/${id}`,
      `${BASE_URL}movie/${id}/videos`,
      `${BASE_URL}movie/${id}/credits`,
    ]);

    const movie = dataList.at(0).value;
    state.movie = {
      budget: movie.budget,
      genres: movie.genres,
      homepage: movie.homepage,
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      posterPath: movie.poster_path,
      releaseDate: movie.release_date,
      runtime: movie.runtime,
      status: movie.status,
      tagline: movie.tagline,
      voteAverage: movie.vote_average,
      voteCount: movie.vote_count,
      language: movie.original_language,
      languageInEng: movie.spoken_languages,
    };

    if (state.watchlist.some((mov) => mov.id === +id))
      state.movie.watchlist = true;
    else state.movie.watchlist = false;

    const videos = dataList.at(1).value.results;
    state.movie.trailer = videos
      ? videos.find(
          (vid) =>
            vid.official === true &&
            vid.site === "YouTube" &&
            vid.type === "Trailer"
        )
      : null;

    const { cast, crew } = dataList.at(2).value;
    state.movie.casts = cast.slice(0, 10).map((cast) => ({
      name: cast?.name,
      profilePath: cast?.profile_path,
      id: cast?.id,
    }));

    const director = crew.find(
      (crew) => crew.department === "Directing" && crew.job === "Director"
    );
    state.movie.director = {
      name: director?.name,
      profilePath: director?.profile_path,
      id: director?.id,
    };
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = async function (page = 1) {
  const minIndex = (page - 1) * RES_PER_PAGE;
  const maxnIndex = RES_PER_PAGE * page;

  try {
    if (
      minIndex >= state.search.results.length &&
      page <= state.search.totalPages
    )
      await loadResults(state.search.query, page);

    state.search.page = page;

    return state.search.results.slice(minIndex, maxnIndex);
  } catch (err) {
    throw err;
  }
};

export const AddToWatchlist = function (movie) {
  state.watchlist.push(movie);
  state.movie.watchlist = true;

  // Save watchlist
  persistWatchlist();
};

export const removeFromWatchlist = function (id) {
  state.watchlist = state.watchlist.filter((mov) => mov.id !== id);
  state.movie.watchlist = false;

  // Save watchlist
  persistWatchlist();
};

const persistWatchlist = function () {
  localStorage.setItem("watchlist", JSON.stringify(state.watchlist));
};

const init = function () {
  const storage = localStorage.getItem("watchlist");
  if (storage) state.watchlist = JSON.parse(storage);
};
init();
