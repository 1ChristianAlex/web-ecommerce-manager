import { IHttpAdapter } from "@common/http/adapter.types";
import { LoginBody } from "../input/LoginBody";
import { ApiResponse } from "../output/ApiResponse";
import { LoginResponse } from "../output/LoginResponse";

class LoginRepository {
	constructor(private _adapter: IHttpAdapter) {}

	doLogin(login: LoginBody) {
		return this._adapter.post<ApiResponse<LoginResponse>>("/login", login);
	}
}

export { LoginRepository };
