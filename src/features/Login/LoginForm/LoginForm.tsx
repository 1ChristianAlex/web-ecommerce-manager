import { KeyIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import c from "classnames";
import React from "react";
import LoginFormErrorAlert from "./LoginFormErrorAlert";
import { useLoginForm } from "./useLoginForm";

const LoginForm: React.FC = () => {
	const { dataForm, validateForm, handleLoginChange, isLoginDisable } =
		useLoginForm();
	const hasPassError = !!dataForm.erro?.password;

	return (
		<div className="w-1/3 m-auto h-auto card bg-base-300 shadow-xl flex items-center rounded gap-2 flex-col p-5">
			<h1 className="w-fit flex text-4xl mb-2">Login</h1>
			<label
				className={c(
					"input input-bordered flex items-center gap-2 rounded w-full",
					{ "input-error": !!dataForm.erro?.email },
				)}
			>
				<UserCircleIcon className="w-4 h-4 opacity-70" />
				<input
					type="text"
					className="grow"
					placeholder="Email"
					onChange={(event) => {
						handleLoginChange("email", event.target.value);
					}}
				/>
			</label>
			{dataForm.erro?.email && (
				<LoginFormErrorAlert message={dataForm.erro?.email} />
			)}

			<label
				className={c(
					"input input-bordered flex items-center gap-2 rounded w-full",
					{ "input-error": hasPassError, "mb-4": !hasPassError },
				)}
			>
				<KeyIcon className="w-4 h-4 opacity-70" />
				<input
					type="password"
					className="grow"
					placeholder="Password"
					onChange={(event) => {
						handleLoginChange("password", event.target.value);
					}}
				/>
			</label>

			{dataForm.erro?.password && (
				<LoginFormErrorAlert message={dataForm.erro?.password} />
			)}

			<button
				type="button"
				className="btn btn-active btn-primary w-full disabled:bg-base-100"
				onClick={() => validateForm(dataForm.data)}
				disabled={isLoginDisable}
			>
				Entrar
			</button>
			<button
				type="button"
				className="btn btn-active btn-secondary w-full disabled:bg-base-100"
			>
				Cadastrar
			</button>
		</div>
	);
};

export default LoginForm;
