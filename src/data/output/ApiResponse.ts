class ApiResponse<T> {
	constructor(data: ApiResponse<T>) {
		Object.assign(this, data);
	}
	result!: T;
	errorMessage!: string;
}

export { ApiResponse };
