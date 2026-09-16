import { useContext, createContext, useState, useEffect, type ReactNode } from "react";
import type { DataContextValue, Movie } from "../types/database";

const DataEnviroment = createContext<DataContextValue | undefined>(undefined);

export function DataCtx({ children }: { children: ReactNode }) {
	const [list, setList] = useState<Movie[]>([]);
	const [data, setData] = useState<unknown>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const apiKey: string = import.meta.env.VITE_API_KEY;
	const [currentIndex, setIndex] = useState(1);
	const [url, setURL] = useState(
		`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=es-ES&page=${currentIndex}`,
	);
	async function fetchData(requestUrl: string = url): Promise<void> {
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
		const newUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=es-ES&page=${newIndex}`;
		setURL(newUrl);
		await fetchData(newUrl);
	};

	useEffect(() => {
		fetchData();
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
