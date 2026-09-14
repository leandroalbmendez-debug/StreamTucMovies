import type { Dispatch, SetStateAction } from "react";

export type Movie = {
	title: string;
	poster_path: string | null;
};

export type DataContextValue = {
	list: Movie[];
	setList: Dispatch<SetStateAction<Movie[]>>;
	currentIndex: number;
	setIndex: Dispatch<SetStateAction<number>>;
	data: unknown;
	loading: boolean;
	nudge: (step?: number) => Promise<void>;
	jumpTo: (newIndex: number) => Promise<void>;
};
