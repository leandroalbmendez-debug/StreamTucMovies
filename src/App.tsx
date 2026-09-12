import { createBrowserRouter } from "react-router";
import "./css/App.css";
import { Index } from "./pages/Index";
import { RouterProvider } from "react-router/dom";
import { Login } from "./pages/Login";
import { Catalog } from "./components/catalog";
import { NotFound } from "./pages/404";

function App() {
	const router = createBrowserRouter([
		{
			path: "/",
			element: <Index />,
		},
		{
			path: "/login",
			element: <Login />,
		},
		{
			path: `/catalog`,
			element: <Catalog />,
		},
		{
			path: `*`,
			element: <NotFound />,
		},
	]);
	return (
		<>
			<RouterProvider router={router} />
		</>
	);
}

export default App;
