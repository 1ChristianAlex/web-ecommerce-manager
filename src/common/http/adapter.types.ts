enum REQUEST_METHODS {
	GET = "GET",
	POST = "POST",
	PUT = "PUT",
	DELETE = "DELETE",
	PATCH = "PATCH",
}

interface IRequestOptions {
	header?: Record<
		string | number,
		string | number | boolean | null | undefined
	>;
	params?: Record<
		string | number,
		string | number | boolean | null | undefined
	>;

	responseType?: RESPONSE_TYPES;
}

type IResponseType<T = unknown> = {
	[key: string]: unknown;
	status: number;
	data: T;
};

enum RESPONSE_TYPES {
	JSON = "json",
	TEXT = "text",
	ARRAYBUFFER = "arraybuffer",
	BLOB = "blob",
}

interface IFetchInstanceParams<T = unknown> {
	url: string;
	body: T;
	requestOptions?: IRequestOptions;
	method: REQUEST_METHODS;
	responseType: RESPONSE_TYPES;
}

interface IHttpAdapter {
	setRequestInterceptor(
		interceptor: (config: RequestInit) => Promise<RequestInit>,
	): void;
	setResponseInterceptor<T = unknown>(
		interceptor: <R = T>(config: R) => Promise<R>,
		// eslint-disable-next-line @typescript-eslint/no-explicit-unknown
		errorInterceptor: <R = T>(config: R) => Promise<unknown>,
	): void;
	get<T = unknown>(
		url: string,
		requestOptions?: IRequestOptions,
	): Promise<IResponseType<T>>;
	post<R = unknown, T = unknown>(
		url: string,
		body: T,
		requestOptions?: IRequestOptions,
	): Promise<IResponseType<R>>;
	patch<R = unknown, T = unknown>(
		url: string,
		body: T,
		requestOptions?: IRequestOptions,
	): Promise<IResponseType<R>>;
	put<R = unknown, T = unknown>(
		url: string,
		body: T,
		requestOptions?: IRequestOptions,
	): Promise<IResponseType<R>>;
	delete<R = unknown, T = unknown>(
		url: string,
		body?: T,
		requestOptions?: IRequestOptions,
	): Promise<IResponseType<R>>;
}

export type {
	IHttpAdapter,
	IRequestOptions,
	IResponseType,
	IFetchInstanceParams,
};

export { REQUEST_METHODS, RESPONSE_TYPES };
