import { createBrowserRouter } from 'react-router';
import './css/App.css'
import { Index } from './pages/Index';
import { RouterProvider } from 'react-router/dom';
import { Login } from './pages/Login';

function App() {
const router = createBrowserRouter([
		{
			path: "/",
			element: <Index/>,
		},
    {
			path: "/login",
			element: <Login/>,
		},
	]);
  return (
    <>
    <RouterProvider router={router} />
    </>
  )
}

export default App
