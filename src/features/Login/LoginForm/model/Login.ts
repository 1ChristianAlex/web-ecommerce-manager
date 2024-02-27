import { IsEmail, IsString, MinLength } from "class-validator";

class Login {
	constructor(data?: Login) {
		if (data) {
			Object.assign(this, data);
		}
	}

	@IsEmail()
	email = "";

	@IsString()
	@MinLength(8)
	password = "";
}

export { Login };
