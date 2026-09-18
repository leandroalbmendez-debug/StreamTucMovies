import type { Dispatch, SetStateAction } from "react";

export type Movie = {
	adult: false,
      backdrop_path: string,
      genre_ids: number[],
      id: number,
      original_language: string,
      original_title: string,
      overview: string,
      popularity: number,
      poster_path: string,
      release_date: string | Date,
      title: string,
      video: boolean,
      vote_average: number,
      vote_count: number
};

export type DataContextValue = {
	list: Movie[];
	setList: Dispatch<SetStateAction<Movie[]>>;
      maxPage: number;
	currentIndex: number;
	setIndex: Dispatch<SetStateAction<number>>;
	data: unknown;
	loading: boolean;
	nudge: (step?: number) => Promise<void>;
	jumpTo: (newIndex: number) => Promise<void>;
      selectedGenre: number | null;
      selectGenre: (genreId: number | null) => Promise<void>;
};
