import type { Movie } from "../types/database";
import { initialMovies } from "./initialMovies";
import { customMovieImageUrl, movieImageUrl } from "./movieImages";

export type CustomMovie = Movie & { isCustom: true; isHidden?: boolean };

export const CUSTOM_MOVIES_KEY = "streamtuc-custom-movies";
export const CUSTOM_MOVIE_BIN_KEY = "streamtuc-custom-movie-bin";
export const FEATURED_MOVIES_KEY = "streamtuc-featured-movies";
export const CUSTOM_MOVIES_CHANGE_EVENT = "streamtuc-custom-movies-change";

export const MOVIE_GENRES = [
  { label: "Aventura", id: 12 },
  { label: "Acción", id: 28 },
  { label: "Animación", id: 16 },
  { label: "Comedia", id: 35 },
  { label: "Ciencia ficción", id: 878 },
  { label: "Crimen", id: 80 },
  { label: "Documental", id: 99 },
  { label: "Drama", id: 18 },
  { label: "Familia", id: 10751 },
  { label: "Fantasía", id: 14 },
  { label: "Historia", id: 36 },
  { label: "Misterio", id: 9648 },
  { label: "Música", id: 10402 },
  { label: "Romance", id: 10749 },
  { label: "Thriller", id: 53 },
  { label: "Terror", id: 27 },
  { label: "Guerra", id: 10752 },
  { label: "Western", id: 37 },
];

export function createCustomMovie(values: Partial<Movie> & { isHidden?: boolean }): CustomMovie {
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
    isHidden: values.isHidden ?? false,
    isCustom: true,
  };
}

export function notifyCustomMoviesChange() {
  window.dispatchEvent(new Event(CUSTOM_MOVIES_CHANGE_EVENT));
}

export function saveFeaturedMovies(movies: Movie[]) {
  localStorage.setItem(FEATURED_MOVIES_KEY, JSON.stringify(movies));
  window.dispatchEvent(new Event("streamtuc-featured-change"));
}

export function readFeaturedMovies(): Movie[] {
  const stored = localStorage.getItem(FEATURED_MOVIES_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored) as Movie[];
  } catch {
    return [];
  }
}

export function readCustomMovies(): CustomMovie[] {
  const stored = localStorage.getItem(CUSTOM_MOVIES_KEY);
  if (!stored) {
    return initialMovies.map((movie) => createCustomMovie({ ...movie, isHidden: false }));
  }

  try {
    return (JSON.parse(stored) as CustomMovie[]).map((movie) => createCustomMovie(movie));
  } catch {
    return [];
  }
}

export function isCustomMovie(movie: Movie): movie is CustomMovie {
  return "isCustom" in movie && movie.isCustom === true;
}

export function getMoviePosterUrl(movie: Movie | undefined | null): string {
  if (!movie) return "";
  return isCustomMovie(movie) ? customMovieImageUrl(movie.poster_path) : movieImageUrl(movie.poster_path);
}
