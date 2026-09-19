export function movieImageUrl(path: string | null | undefined, size: "w500" | "original" = "w500"): string {
	const normalizedPath = path?.trim();
	if (!normalizedPath) return "";

	// Custom movies may store either a remote URL or a Vite-generated local asset URL.
	// TMDB paths also start with "/", so only known app asset roots are local paths.
	if (
		/^(https?:|data:|blob:)/i.test(normalizedPath) ||
		/^\/(assets|posters|images)\//i.test(normalizedPath)
	) {
		return normalizedPath;
	}

	// Relative paths refer to files in public/, not files in src/.
	if (normalizedPath.startsWith("./") || normalizedPath.startsWith("../")) {
		return new URL(normalizedPath, window.location.origin).pathname;
	}

	if (normalizedPath.startsWith("public/")) {
		return `/${normalizedPath.slice("public/".length)}`;
	}

	return `https://image.tmdb.org/t/p/${size}${normalizedPath}`;
}

export function customMovieImageUrl(path: string | null | undefined): string {
	const normalizedPath = path?.trim();
	if (!normalizedPath) return "";
	if (/^(https?:|data:|blob:)/i.test(normalizedPath)) return normalizedPath;
	if (/^public\//i.test(normalizedPath)) return `/${normalizedPath.slice("public/".length)}`;
	if (normalizedPath.startsWith("/")) return normalizedPath;
	return `/${normalizedPath.replace(/^\.\//, "")}`;
}