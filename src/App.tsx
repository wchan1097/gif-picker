import { useState, useEffect } from 'react';
import { fetchRandomGifs, fetchQueryGifs } from './services/giphyService';
import GifCard from './components/gifCard';
import type GifModel from './models/gifModel';
import "./App.css";
import { isNumber } from './services/utilityService';

const PAGE_SIZE = 16;
const RANDOM_PAGE_SIZE = 3;

function Home() {
	// URL PROCESSING
	const searchParams = new URLSearchParams(window.location.search);

	const [query, setQuery] = useState<string>(searchParams.get("search") ?? "");
	const [input, setInput] = useState<string>(searchParams.get("search") ?? "");
	const [gifs, setGifs] = useState<any[]>([]);
	const [page, setPage] = useState<number>( () => {
		const urlPage = searchParams.get("p");
		return (urlPage && isNumber(urlPage) ? parseInt(urlPage) : 1)
	});

	// Add the url parameter 'search' if it is missing.
	useEffect(() => {
		if (!searchParams.has("search")) {
			const params = new URLSearchParams();
			params.set("search", "");
			window.history.replaceState(null, "", `${window.location.pathname}?${params}`);
		}

		function onPopState() {
			const params = new URLSearchParams(window.location.search);
			const urlSearch = params.get("search") ?? "";
			const urlPage = params.get("p");
			
			setQuery(urlSearch);
			setInput(urlSearch);
			setPage(urlPage && isNumber(urlPage) ? parseInt(urlPage) : 1);
		}

		window.addEventListener("popstate", onPopState);

		return () => window.removeEventListener("popstate", onPopState);
	}, []);

	// If the search box is updated, start a timer to determine 
	// if the form needs to be submitted. The timer will be interrupted if the user
	// continues to update the search. If the timer reaches 0, then submit the form.
	useEffect(() => {
		if (input == query) return;

		const timeoutId = setTimeout(
		() => {
				setQuery(input);
				setPage(1);
				const params = new URLSearchParams();
				params.set("search", input);
				window.history.pushState(null, "", `${window.location.pathname}?${params}`);
			}, 
			1500
		);

		return () => clearTimeout(timeoutId)
	}, [input])

	// Update the title of the web page
	useEffect(() => {
		document.title = query ? `Gif Picker - ${query}` : 'Gif Picker';
	}, [query]);

	// Retrieve gifs
	useEffect(() => {
		const controller = new AbortController();

		async function loadGifs() {
			const offset = (page - 1) * PAGE_SIZE;

			let results = (query) 
				? await fetchQueryGifs(query, PAGE_SIZE, offset, controller)
				: await fetchRandomGifs(RANDOM_PAGE_SIZE, controller)

			setGifs(results);
		}

		loadGifs();
		
		return () => controller.abort();
	}, [query, page]);

	function handleFormSubmission(event: React.FormEvent<HTMLFormElement>): void {
		event.preventDefault();
		// setSearchParams({search: input})
	}

	// MARK: START RETURN 
  return (
    <>
			<main style={{ maxWidth: "1000px", margin: "0 auto", paddingTop: "1rem", paddingBottom: "2rem"}}>	
				<h3 style={{ color: "#bababa" }}>Hi There! 👋</h3>
				<h1>Welcome to Gif Picker</h1>

				<p>Type in the search bar below and then wait. Your GIFs will appear shortly.</p>

				{/* MARK: GIF SEARCH FORM */}
				<form onSubmit={handleFormSubmission}>
					<div style={{ display: "flex", gap: "1rem"}}>
						<div style={{ flexGrow: "1"}}>
							<input 
								type="text" 
								name="query" 
								value={input} 
								style={{ borderRadius: ".25rem", border: "none", padding: "9px 12px", width: "100%"}}
								placeholder='Batman'
								onChange={(event) => setInput(event.target.value)}
							/>
						</div>
						
						<a href={"/?search="} className="btn-outline-white">Clear</a>
					</div>
				</form>

				{/* MARK: GIF LIST */}
				<section style={{ marginTop: "2rem" }}>
					<h2 style={{ marginBottom: "1rem"}}>
						{
							query 
							? `Gifs For ${query}`
							: "Not Sure What to Look for? Try These Out!"
						}
					</h2>

					{
						!gifs.length ? (
							<p>No gifs found.</p>
						) : (
							<div 
								style={{
									display: "grid", 
									gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
									gap: "15px"
								}}
							>
								{
									gifs.map((gifData, gifIndex) => {
										const gifModel: GifModel = {
											"web_url": gifData.url, 
											"image": {
												"height": gifData.images.fixed_height.height,
												"width": gifData.images.fixed_height.width,
												"url": gifData.images.fixed_height.mp4
											}
										}
										return (
											<GifCard 
												gifModel={gifModel} 
												key={`${gifIndex}-${gifData.id}`}
											/>
										)
									})
								}
							</div>
						)
					}
				</section>

				{/* MARK: PAGINATION */}
				{ 
					(query && gifs.length) ? (
						<section style={{ display: "flex", justifyContent: "center", marginTop: "2rem", gap: "1rem" }}>
							{ page - 1 !== 0 && (
								<a href={`?search=${input}&p=${page - 1}`} className='btn-outline-white'>Prev</a>
							)}
							<span style={{ backgroundColor: "white", padding: "8px 8px", borderRadius: "5px"}}>
								Page {page}
							</span>
							<a href={`?search=${input}&p=${page + 1}`} className='btn-outline-white'>Next</a>
						</section>
					) : ''
				}
			</main>
    </>
  )
}

export default Home