import { callApi } from "@/services/apiService";

export const getTierList = async (league) =>

	new Promise((resolve, reject) => {

		const apiCall = callApi(
			"get",
			"tiers/",
			{
				league,
			}
		)
			.then((response) =>
				resolve(response.data))

			.catch((error) =>
				reject(error));

	});
