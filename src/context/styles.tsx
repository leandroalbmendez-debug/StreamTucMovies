import { useLocalStorage } from "@uidotdev/usehooks";
import { createContext, useContext, type ReactNode } from "react";
import { useMediaQuery } from "react-device-sizes";

interface StyleContextValue {
	isMobile: boolean;
	isTablet: boolean;
	isLaptop: boolean;
	theme: string;
	switchTheme: () => void;
}

const StyleEnviroment = createContext<StyleContextValue | undefined>(undefined);

export function StyleCtx({ children }: { children: ReactNode }) {
	const [theme, setTheme] = useLocalStorage("theme", "light");
	const isMobile: boolean = useMediaQuery({ maxWidth: 767 });
	const isTablet: boolean = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
	const isLaptop: boolean = useMediaQuery({ minWidth: 1224 });

	function switchTheme() {
		if (theme === "light") {
			setTheme("dark");
			return;
		}
		setTheme("light");
	}

	return (
		<StyleEnviroment.Provider
			value={{
				isMobile,
				isTablet,
				isLaptop,
				theme,
				switchTheme,
			}}>
			{children}
		</StyleEnviroment.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export const useStyle = () => {
	const context = useContext(StyleEnviroment);
	if (context === undefined) {
		throw new Error("useStyle must be used within a StyleCtx");
	}
	return context;
};