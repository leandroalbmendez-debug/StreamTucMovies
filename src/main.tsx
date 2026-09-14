import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App.tsx";
import { DataCtx } from "./context/database.tsx";
import Layout from "./pages/layout.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Layout>
			<DataCtx>
				<App />
			</DataCtx>
		</Layout>
	</StrictMode>,
);
