import { useLocalStorage } from "@uidotdev/usehooks";
import { useContext, createContext, useState, useEffect } from "react";
const DataEnviroment = createContext(undefined);

export function DataCtx({ children }) {
	const [list, setList] = useState(null);
	const [featured, setFeatured] = useState(null);
	const [categories, setCategories] = useState(null);
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState<boolean>(true);
	const apiKey: string = import.meta.env.VITE_API_KEY;
	const [currentIndex, setIndex] = useState(1);
	const [url, setURL] = useState(
		`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=es-ES&page=${currentIndex}`,
	);
	async function fetchData(requestUrl = url) {
		setLoading(true);
		try {
			const response = await fetch(requestUrl);
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			const result = await response.json();
			setData(result);
			console.log(result);
			setList(result.results);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	}

	const nudge = async (step = 0) => {
		const newIndex = currentIndex + step;
		jumpTo(newIndex);
	};

	const jumpTo = async (newIndex) => {
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
