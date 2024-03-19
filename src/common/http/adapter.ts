import queryString from "query-string";
import {
	IFetchInstanceParams,
	IHttpAdapter,
	IRequestOptions,
	IResponseType,
	REQUEST_METHODS,
	RESPONSE_TYPES,
} from "./adapter.types";

class FetchHttpAdapter implements IHttpAdapter {
	public baseUrl = "";

	private _requestInterceptors: Array<
		(currentRequest: RequestInit) => Promise<RequestInit>
	> = [];
	private _responseInterceptors: Array<(res: Response) => Promise<Response>> =
		[];
	private _responseErrorInterceptors: Array<
		(res: Response) => Promise<Response>
	> = [];

	setResponseInterceptor<T = Response>(
		response: <R = T>(config: R) => Promise<R>,
		errorInterceptor: <R = T>(config: R) => Promise<R>,
	): void {
		if (response) {
			this._responseInterceptors.push(response);
		}

		if (errorInterceptor) {
			this._responseErrorInterceptors.push(errorInterceptor);
		}
	}

	setRequestInterceptor(
		interceptor: (config: RequestInit) => Promise<RequestInit>,
	): void {
		this._requestInterceptors.push(interceptor);
	}

	private request = async <ResponseBodyType>(
		fetchParams: IFetchInstanceParams,
	): Promise<IResponseType<ResponseBodyType>> => {
		try {
			let fetchOptions = this.initialFetchOptions(fetchParams);

			for (const currentInterceptor of this._requestInterceptors) {
				const newFetchOptions = await currentInterceptor(fetchOptions);

				fetchOptions = {
					...newFetchOptions,
					...fetchOptions,
					headers: {
						...newFetchOptions.headers,
						...fetchOptions.headers,
					},
				};
			}

			let fetchUrl = fetchParams.url;

			if (this.baseUrl) {
				fetchUrl = `${this.baseUrl.replace(/\/$/gi, "")}/${fetchUrl.replace(
					/^\//gi,
					"",
				)}`;
			}

			if (fetchParams?.requestOptions?.params) {
				fetchUrl = this.parseUrlParams(fetchParams);
			}

			const response = await fetch(fetchUrl, fetchOptions).then(
				async (response) => {
					const responseRef = response;

					for (const currentInterceptor of this._responseInterceptors) {
						const newResponse = await currentInterceptor(responseRef);

						Object.assign(responseRef, newResponse);
					}
					if (!response.ok) {
						throw {
							...fetchParams,
							headers: response.headers,
							status: response.status,
							ok: response.ok,
							body: response.body,
						} as IFetchInstanceParams & Response;
					}

					return {
						data: await this.getResponseProcessor(
							fetchParams.responseType,
							response,
						),
						status: response.status,
					} as IResponseType<ResponseBodyType>;
				},
			);

			return response;
		} catch (error) {
			for (const currentInterceptor of this._responseErrorInterceptors) {
				const errResponse = error as IFetchInstanceParams & Response;
				const newResponse = await currentInterceptor(errResponse);

				Object.assign(errResponse, newResponse);
			}
			throw error;
		}
	};

	private getResponseProcessor = (
		responseType: RESPONSE_TYPES,
		fetchResponse: Response,
	) => {
		if (fetchResponse.status === 204) {
			return null;
		}

		switch (responseType) {
			case RESPONSE_TYPES.TEXT:
				return fetchResponse.text();
			case RESPONSE_TYPES.ARRAYBUFFER:
				return fetchResponse.arrayBuffer();
			case RESPONSE_TYPES.BLOB:
				return fetchResponse.blob();
			default:
				return fetchResponse.json();
		}
	};

	private parseUrlParams(fetchParams: IFetchInstanceParams) {
		if (fetchParams?.requestOptions?.params) {
			const copy = { ...fetchParams.requestOptions.params };

			for (const [key, value] of Object.entries(copy)) {
				if (value === null || value === undefined) {
					delete copy[key];
				}
			}

			return `${fetchParams.url}?${queryString.stringify(copy)}`;
		}

		return fetchParams.url;
	}

	private initialFetchOptions(fetchParams: IFetchInstanceParams) {
		const fetchOptions: RequestInit = {
			headers: {
				...(fetchParams.requestOptions?.header || {}),
				"Content-Type": "application/json",
			},
			method: fetchParams.method,
			credentials: "same-origin",
		};

		if (fetchParams.body && fetchParams.method !== REQUEST_METHODS.GET) {
			fetchOptions.body =
				fetchParams.responseType === RESPONSE_TYPES.JSON
					? JSON.stringify(fetchParams?.body)
					: (fetchParams?.body as ReadableStream);
		}
		return fetchOptions;
	}

	put<R = unknown, T = unknown>(
		url: string,
		body: T,
		requestOptions?: IRequestOptions,
	): Promise<IResponseType<R>> {
		return this.request<R>({
			url,
			body,
			requestOptions,
			method: REQUEST_METHODS.PUT,
			responseType: requestOptions?.responseType || RESPONSE_TYPES.JSON,
		});
	}
	delete<R = unknown, T = unknown>(
		url: string,
		body?: T,
		requestOptions?: IRequestOptions,
	): Promise<IResponseType<R>> {
		return this.request<R>({
			url,
			body,
			requestOptions,
			method: REQUEST_METHODS.DELETE,
			responseType: requestOptions?.responseType || RESPONSE_TYPES.JSON,
		});
	}
	post<R = unknown, T = unknown>(
		url: string,
		body: T,
		requestOptions?: IRequestOptions,
	): Promise<IResponseType<R>> {
		return this.request<R>({
			url,
			body,
			requestOptions,
			method: REQUEST_METHODS.POST,
			responseType: requestOptions?.responseType || RESPONSE_TYPES.JSON,
		});
	}

	patch<R = unknown, T = unknown>(
		url: string,
		body: T,
		requestOptions?: IRequestOptions,
	): Promise<IResponseType<R>> {
		return this.request<R>({
			url,
			body,
			requestOptions,
			method: REQUEST_METHODS.PATCH,
			responseType: requestOptions?.responseType || RESPONSE_TYPES.JSON,
		});
	}

	get<T = unknown>(
		url: string,
		requestOptions?: IRequestOptions,
	): Promise<IResponseType<T>> {
		return this.request<T>({
			url,
			requestOptions,
			method: REQUEST_METHODS.GET,
			body: null,
			responseType: requestOptions?.responseType || RESPONSE_TYPES.JSON,
		});
	}
}

export default FetchHttpAdapter;
