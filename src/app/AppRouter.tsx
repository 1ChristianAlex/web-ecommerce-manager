import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/Login/LoginPage";

const router = createBrowserRouter([
	{
		path: "/",
		element: <LoginPage />,
	},
]);

const AppRouter: React.FC = () => {
	return <RouterProvider router={router} />;
};

export default AppRouter;
