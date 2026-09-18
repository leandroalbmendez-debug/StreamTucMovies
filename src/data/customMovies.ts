import type { Movie } from "../types/database";

export type CustomMovie = Movie & { isCustom: true };

export const CUSTOM_MOVIES_KEY = "streamtuc-custom-movies";
export const CUSTOM_MOVIE_BIN_KEY = "streamtuc-custom-movie-bin";
export const FEATURED_MOVIES_KEY = "streamtuc-featured-movies";
export const CUSTOM_MOVIES_CHANGE_EVENT = "streamtuc-custom-movies-change";

export const MOVIE_GENRES = [
  { label: "Acción", id: 28 },
  { label: "Ciencia ficción", id: 878 },
  { label: "Drama", id: 18 },
  { label: "Thriller", id: 53 },
  { label: "Terror", id: 27 },
  { label: "Comedia", id: 35 },
  { label: "Animación", id: 16 },
];

export function createCustomMovie(values: Partial<Movie>): CustomMovie {
  const title = values.title?.trim() || "Sin título";
  const id = values.id ?? -Date.now();

  return {
    adult: false,
    backdrop_path: values.backdrop_path || values.poster_path || "",
    genre_ids: values.genre_ids || [],
    id,
    original_language: values.original_language || "es",
    original_title: values.original_title || title,
    overview: values.overview || "",
    popularity: values.popularity || 0,
    poster_path: values.poster_path || "",
    release_date: values.release_date || "",
    title,
    video: false,
    vote_average: values.vote_average || 0,
    vote_count: values.vote_count || 0,
    isCustom: true,
  };
}

export function notifyCustomMoviesChange() {
  window.dispatchEvent(new Event(CUSTOM_MOVIES_CHANGE_EVENT));
}

export function isCustomMovie(movie: Movie): movie is CustomMovie {
  return "isCustom" in movie && movie.isCustom === true;
}
