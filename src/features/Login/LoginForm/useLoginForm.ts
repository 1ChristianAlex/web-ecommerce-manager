import { validate } from "class-validator";
import { useMemo, useState } from "react";
import { DataForm } from "../../../common/model/DataForm";
import { Login } from "./model/Login";

const useLoginForm = () => {
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

	return { dataForm, validateForm, handleLoginChange, isLoginDisable };
};

export { useLoginForm };
