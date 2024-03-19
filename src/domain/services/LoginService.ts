import { Result } from "@common/model/Result";
import { LoginBody } from "../../data/input/LoginBody";
import { LoginResponse } from "../../data/output/LoginResponse";
import { LoginRepository } from "../../data/repository/LoginRepository";

class LoginService {
	constructor(private _loginRepo: LoginRepository) {}
	async doLogin(login: LoginBody): Promise<Result<LoginResponse | null>> {
		try {
			const result = await this._loginRepo.doLogin(login);

			if (result.data.errorMessage) {
				throw new Error(result.data.errorMessage);
			}

			return new Result(result.data.result, null);
		} catch {
			return new Result(null, new Error("Erro on Login"));
		}
	}
}

export { LoginService };
