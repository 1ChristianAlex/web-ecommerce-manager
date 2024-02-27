import { ValidationError } from "class-validator";

type ErrorDataForm<T> = {
	[type in keyof T]: string;
};

class DataForm<T> {
	constructor(
		public data: T,
		erro?: ValidationError[] | null,
	) {
		if (erro?.length) {
			this.erro = this.fromValidationError(erro);
		}
	}

	public erro?: ErrorDataForm<T> | null;

	private fromValidationError(erros: ValidationError[]) {
		return Object.fromEntries(
			erros.map((item) => {
				const text = Object.values(item.constraints || {});

				return [item.property, text.at(0) || ""];
			}),
		) as ErrorDataForm<T>;
	}
}
export type { ErrorDataForm };
export { DataForm };
