class LoginBody {
	constructor(data: LoginBody) {
		Object.assign(this, data);
	}

	public email!: string;

	public password!: string;
}

export { LoginBody };
