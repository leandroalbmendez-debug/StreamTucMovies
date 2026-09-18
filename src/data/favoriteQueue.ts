import { initialUsers } from "./initialUsers";
import type { User } from "../types/User";

let favoriteUpdateQueue = Promise.resolve();

export function queueFavoriteUpdate(movieId: number, favoriteState?: boolean): Promise<User | null> {
	const update = favoriteUpdateQueue.then(() => {
		const storedUser = localStorage.getItem("streamtuc-logged-user");
		const loggedUser = storedUser ? (JSON.parse(storedUser) as User) : null;
		if (!loggedUser) return null;

		const isFavorite = loggedUser.favorites.includes(movieId);
		const shouldBeFavorite = favoriteState ?? !isFavorite;
		if (isFavorite === shouldBeFavorite) return loggedUser;

		const updatedUser = {
			...loggedUser,
			favorites: shouldBeFavorite
				? [...loggedUser.favorites, movieId]
				: loggedUser.favorites.filter((favoriteId) => favoriteId !== movieId),
		};
		const storedUsers = localStorage.getItem("streamtuc-users");
		const users = storedUsers ? (JSON.parse(storedUsers) as User[]) : initialUsers;

		localStorage.setItem("streamtuc-logged-user", JSON.stringify(updatedUser));
		localStorage.setItem(
			"streamtuc-users",
			JSON.stringify(users.map((user) => user.id === updatedUser.id ? updatedUser : user)),
		);

		return updatedUser;
	});

	favoriteUpdateQueue = update.then(() => undefined, () => undefined);
	return update;
}

export function notifyFavoriteChange(updatedUser: User) {
	window.dispatchEvent(
		new CustomEvent<User>("streamtuc-favorites-change", {
			detail: updatedUser,
		}),
	);
}
