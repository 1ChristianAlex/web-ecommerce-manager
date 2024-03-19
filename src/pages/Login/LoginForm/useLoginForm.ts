import { validate } from "class-validator";
import { useMemo, useState } from "react";
import { DataForm } from "../../../common/model/DataForm";
import { LoginBody } from "../../../data/input/LoginBody";
import { LoginRepository } from "../../../data/repository/LoginRepository";
import { LoginService } from "../../../domain/services/LoginService";
import { useEcommerceAdapter } from "../../../hooks/useHttpAdapter";
import { Login } from "./model/Login";

const useLoginForm = () => {
	const adapter = useEcommerceAdapter();

	const loginService = new LoginService(new LoginRepository(adapter));

	const [dataForm, setDataForm] = useState(new DataForm(new Login(), null));

	const isLoginDisable = useMemo(
		() =>
			Boolean(
				Object.values(dataForm.data).some((item) => item === "") ||
					(dataForm.erro && Object.values(dataForm.erro).length),
			),
		[dataForm.data, dataForm.erro],
	);

	const validateForm = async (form: Login) => {
		if (form) {
			const erros = await validate(form);

			if (erros?.length) {
				setDataForm(new DataForm(form, erros));

				return false;
			}
		}

		return true;
	};

	const handleLoginChange = (name: keyof Login, value: string) => {
		setDataForm(
			(current) => new DataForm(new Login({ ...current.data, [name]: value })),
		);
	};

	const handleLogin = async () => {
		const isValid = await validateForm(dataForm.data);

		if (isValid) {
			const result = await loginService.doLogin(
				new LoginBody({
					email: dataForm.data.email,
					password: dataForm.data.password,
				}),
			);

			console.log({ result });
		}
	};

	return { dataForm, handleLoginChange, isLoginDisable, handleLogin };
};

export { useLoginForm };
