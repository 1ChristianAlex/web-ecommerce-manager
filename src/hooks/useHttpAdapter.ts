import FetchHttpAdapter from "@common/http/adapter";
import HttpEcommerceAdapter from "../data/http.ecommerge";

const useDefaultAdapter = () => {
	return new FetchHttpAdapter();
};

const useEcommerceAdapter = (singleton = true) => {
	if (singleton) {
		return HttpEcommerceAdapter.getInstance();
	}
	return new HttpEcommerceAdapter();
};

export { useDefaultAdapter, useEcommerceAdapter };
