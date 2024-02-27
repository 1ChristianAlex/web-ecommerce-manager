import LoginForm from "@features/Login/LoginForm/LoginForm";
import React from "react";

const LoginPage: React.FC = () => {
	return (
		<main className="h-screen w-screen flex items-center">
			<LoginForm />
		</main>
	);
};

export default LoginPage;
