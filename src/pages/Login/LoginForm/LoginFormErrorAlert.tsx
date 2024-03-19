import { XCircleIcon } from "@heroicons/react/24/solid";
import React from "react";
interface Props {
	message: string;
}

const LoginFormErrorAlert: React.FC<Props> = ({ message }) => {
	const [first, ...rest] = message;
	return (
		<div role="alert" className="alert alert-error rounded w-full p-2 mb-4">
			<XCircleIcon className="h-6 w-6" />
			<span>
				{first.toUpperCase()}
				{rest}
			</span>
		</div>
	);
};

export default LoginFormErrorAlert;
