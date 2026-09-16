import { useContext, createContext, useState, useEffect, type ReactNode } from "react";
import type { DataContextValue, Movie } from "../types/database";

const DataEnviroment = createContext<DataContextValue | undefined>(undefined);

export function DataCtx({ children }: { children: ReactNode }) {
	const [list, setList] = useState<Movie[]>([]);
	const [data, setData] = useState<unknown>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const apiKey: string = import.meta.env.VITE_API_KEY;
	const [currentIndex, setIndex] = useState(1);
	const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

	function buildUrl(page: number, genreId: number | null = selectedGenre) {
		const endpoint = genreId === null ? "movie/popular" : "discover/movie";
		const genreQuery = genreId === null ? "" : `&with_genres=${genreId}`;
		return `https://api.themoviedb.org/3/${endpoint}?api_key=${apiKey}&language=es-ES&page=${page}${genreQuery}`;
	}

	async function fetchData(requestUrl: string): Promise<void> {
		setLoading(true);
		try {
			const response = await fetch(requestUrl);
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			const result = await response.json();
			setData(result);
			setList(result.results);
			console.log(list);
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
		await fetchData(buildUrl(newIndex));
	};

	const selectGenre = async (genreId: number | null): Promise<void> => {
		setSelectedGenre(genreId);
		setIndex(1);
		await fetchData(buildUrl(1, genreId));
	};

	useEffect(() => {
		fetchData(buildUrl(1, null));
	}, []);

	return (
		<DataEnviroment.Provider
			value={{
				list,
				setList,
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
