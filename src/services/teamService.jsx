import { callApi } from "@/services/apiService";

export const getTeamListByTier = async (league, tier, season) =>

	new Promise((resolve, reject) => {

		const apiCall = callApi(
			"get",
			`teams/`,
			{
				league,
				tier,
				season,
			}
		)
			.then((response) =>
				resolve(response.data))

			.catch((error) =>
				reject(error));

	});
