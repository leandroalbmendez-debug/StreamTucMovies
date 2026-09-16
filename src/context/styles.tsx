import { useLocalStorage } from "@uidotdev/usehooks";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useDeviceSize, useMediaQuery } from "react-device-sizes";

const StyleEnviroment = createContext<undefined>(undefined);

export function StyleCtx({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useLocalStorage("theme","light");
	// const deviceSizes = useDeviceSize();
	const isMobile: boolean = useMediaQuery({ maxWidth: 767 });
	const isTablet: boolean = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
	const isLaptop: boolean = useMediaQuery({ minWidth: 1224 });
	// const {
	// 	xsDown, //(max-width: 575.98px)
	// 	onlyXs, //(min-width: 576px) and (max-width: 767.98px)
	// 	xsUp, //(min-width: 576px)
	// 	smDown, //(max-width: 767.98px)
	// 	onlySm, //(min-width: 768px) and (max-width: 991.98px)
	// 	smUp, //(min-width: 768px)
	// 	mdDown, //(max-width: 991.98px)
	// 	onlyMd, //(min-width: 992px) and (max-width: 1199.98px)
	// 	mdUp, //(min-width: 992px)
	// 	lgDown, //(max-width: 1199.98px)
	// 	lgUp, //(min-width: 1200px)
	// } = deviceSizes;

    function switchTheme() {
        if (theme === "light") {
            setTheme("dark");
            return
        }
        setTheme("light");
    }

	return (
		<StyleEnviroment.Provider
			value={{
				// xsDown,
				// onlyXs,
				// xsUp,
				// smDown,
				// onlySm,
				// smUp,
				// mdDown,
				// onlyMd,
				// mdUp,
				// lgDown,
				// lgUp,
				isMobile,
				isTablet,
				isLaptop,
                theme, switchTheme
			}}>
			{children}
		</StyleEnviroment.Provider>
	);
}

export const useStyle = () => {
	const context = useContext(StyleEnviroment);
	if (context === undefined) {
		throw new Error("useUsers must be used within a UserProvider");
	}
	return context;
};
