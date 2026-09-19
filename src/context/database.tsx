import { useContext, createContext, useState, useEffect, useRef, type ReactNode } from "react";
import type { DataContextValue, Movie } from "../types/database";
import { CUSTOM_MOVIES_CHANGE_EVENT, readCustomMovies, type CustomMovie } from "../data/customMovies";

const DataEnviroment = createContext<DataContextValue | undefined>(undefined);

export function DataCtx({ children }: { children: ReactNode }) {
	const [list, setList] = useState<Movie[]>([]);
	const tmdbListRef = useRef<Movie[]>([]);
	const [customMovies, setCustomMovies] = useState<CustomMovie[]>(readCustomMovies);
	const [data, setData] = useState<unknown>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const apiKey = import.meta.env.VITE_API_KEY as string | undefined;
	const [currentIndex, setIndex] = useState(1);
	const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

	function buildUrl(page: number, genreId: number | null = selectedGenre) {
		const endpoint = genreId === null ? "movie/popular" : "discover/movie";
		const genreQuery = genreId === null ? "" : `&with_genres=${genreId}`;
		return `https://api.themoviedb.org/3/${endpoint}?api_key=${apiKey}&language=es-ES&page=${page}${genreQuery}`;
	}

async function fetchData(requestUrl: string, includeCustom = false): Promise<void> {
		setLoading(true);
		try {
			const response = await fetch(requestUrl);
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			const result = await response.json();
			setData(result);
			tmdbListRef.current = result.results;
			const currentCustomMovies = readCustomMovies();
			setCustomMovies(currentCustomMovies);
			const visibleCustomMovies = currentCustomMovies.filter((movie) => !movie.isHidden);
			setList(includeCustom ? [...visibleCustomMovies, ...result.results] : result.results);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	}

	const nudge = async (step = 0): Promise<void> => {
		const newIndex = currentIndex + step;
		jumpTo(newIndex);
	};

	const jumpTo = async (newIndex: number): Promise<void> => {
		setIndex(newIndex);
		await fetchData(buildUrl(newIndex), newIndex === 1 && selectedGenre === null);
	};

	const selectGenre = async (genreId: number | null): Promise<void> => {
		setSelectedGenre(genreId);
		setIndex(1);
		await fetchData(buildUrl(1, genreId), genreId === null);
	};

	useEffect(() => {
		const updateCustomMovies = () => {
			const nextCustomMovies = readCustomMovies();
			setCustomMovies(nextCustomMovies);
			const visibleCustomMovies = nextCustomMovies.filter((movie) => !movie.isHidden);
			setList(currentIndex === 1 && selectedGenre === null ? [...visibleCustomMovies, ...tmdbListRef.current] : tmdbListRef.current);
		};
		window.addEventListener(CUSTOM_MOVIES_CHANGE_EVENT, updateCustomMovies);
		return () => window.removeEventListener(CUSTOM_MOVIES_CHANGE_EVENT, updateCustomMovies);
	}, []);

	useEffect(() => {
		fetchData(buildUrl(1, null), true);
	}, []);

	const maxPage = 500 + Math.ceil(customMovies.length / 30);

	return (
		<DataEnviroment.Provider
			value={{
				list,
				setList,
				maxPage,
				currentIndex,
				setIndex,
				data,
				loading,
				nudge,
				jumpTo,
				selectedGenre,
				selectGenre,
			}}>
			{children}
		</DataEnviroment.Provider>
	);
}

export const useData = () => {
	const context = useContext(DataEnviroment);
	if (context === undefined) {
		throw new Error("useUsers must be used within a UserProvider");
	}
	return context;
};
