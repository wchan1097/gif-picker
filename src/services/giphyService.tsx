// MARK: FUNCTION = fetchQueryGifs
export async function fetchQueryGifs(
	query: string,
	limit: number = 16,
	offset: number = 0, 
	controller?: AbortController
): Promise<any[]> {
	if (!query.length) return [];

	const requestUrl = `https://api.giphy.com/v1/gifs/search`;
	const params = new URLSearchParams();

	params.append("api_key", import.meta.env.VITE_GIPHY_API_KEY);
	params.append("q", query);
	params.append("limit", limit.toString());
	params.append("offset", offset.toString());
	params.append("rating", "g");
	params.append("lang", "en");
	params.append("bundle", "messaging_non_clips");

	let gifs = [];

	try {
		const fetchOptions = (controller) ? { signal: controller.signal} : {};
		const response = await fetch(
			`${requestUrl}?${params}`,
			fetchOptions
		);

		const data = await response.json();

		if (data.meta.status !== 200) throw data.meta.msg;
		if (!data.data) return [];

		gifs = data.data;
	} catch (error) {
		// Error
		console.log(error);
	}

	return gifs;
}

// MARK: FUNCTION = fetchRandomGifs
export async function fetchRandomGifs(
	limit: number = 3,
	controller?: AbortController
): Promise<any[]> {
	const requestUrl = `https://api.giphy.com/v1/gifs/random`;
	const params = new URLSearchParams();

	params.append("api_key", import.meta.env.VITE_GIPHY_API_KEY);

	let randomGifs = [];

	for (let index = 0; index < limit; index++) {
		try {
			const fetchOptions = (controller) ? { signal: controller.signal} : {};
			const response = await fetch(
				`${requestUrl}?${params}`,
				fetchOptions
			);

			const data = await response.json();

			if (data.meta.status !== 200) throw data.meta.msg;

			randomGifs.push(data.data);
		} catch (error) {
			// Error
			console.log(error);
		}
	}

	return randomGifs;
}
