import FetchHttpAdapter from "@common/http/adapter";

class HttpEcommerceAdapter extends FetchHttpAdapter {
	static instance: HttpEcommerceAdapter;

	static getInstance() {
		if (!HttpEcommerceAdapter.instance) {
			HttpEcommerceAdapter.instance = new HttpEcommerceAdapter();
		}

		return HttpEcommerceAdapter.instance;
	}

	constructor() {
		super();
		this.baseUrl = "http://localhost:3333";
		this.bindAuthorization();
	}

	private async getAccessToken() {
		return "";
	}

	private bindAuthorization() {
		this.setRequestInterceptor(async (config) => {
			const accessToken = await this.getAccessToken();
			if (accessToken) {
				return {
					...config,
					headers: {
						...config.headers,
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
					},
				};
			}

			return config;
		});
	}
}

export default HttpEcommerceAdapter;
