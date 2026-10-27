import { useState, useEffect } from 'react';
import { fetchRandomGifs, fetchQueryGifs } from '../services/giphyService';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { Form, Pagination } from 'react-bootstrap';
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../../node_modules/bootstrap-icons/font/bootstrap-icons.css";
import GifCard from '../components/gifCard';
import type GifModel from '../models/gifModel';
import "./home.css";
import { isNumber } from '../services/utilityService';

const PAGE_SIZE = 16;
const RANDOM_PAGE_SIZE = 3;

function Home() {
	// URL PROCESSING
	const [searchParams, setSearchParams] = useSearchParams();
	const query = searchParams.get("search") ?? "";
	const urlPage = searchParams.get("p") ?? "1";

	const [input, setInput] = useState<string>(query);
	const [gifs, setGifs] = useState<any[]>([]);
	const [page, setPage] = useState<number>(
		(isNumber(urlPage)) ? parseInt(urlPage) : 1 
	);

	// Add the url parameter 'search' if it is missing.
	useEffect(() => {
		if (!searchParams.has("search")) setSearchParams(
			{search: '' },
			{replace: true}
		);
	}, []);

	// If the search box is updated, start a timer to determine 
	// if the form needs to be submitted. The timer will be interrupted if the user
	// continues to update the search. If the timer reaches 0, then submit the form.
	useEffect(() => {
		if (input == query) return;

		const timeoutId = setTimeout(
			() => setSearchParams({search: input}), 
			1500
		);

		return () => clearTimeout(timeoutId)
	}, [input])

	// If the url parameters change, update the state.
	useEffect(() => {
		setInput(query);
		if (isNumber(urlPage)) {
			setPage(parseInt(urlPage));
		}
	}, [query, urlPage])

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
		setSearchParams({search: input})
	}

	// MARK: START RETURN 
  return (
    <>
			<main style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 20px"}} className='py-5'>	
				<h3 className='fs-5 text-secondary'>Hi There! 👋</h3>
				<h1 className=" fs-3 mb-3">Welcome to Gif Picker</h1>

				<p>Type in the search bar below and then wait. Your GIFs will appear shortly.</p>

				{/* MARK: GIF SEARCH FORM */}
				<Form onSubmit={handleFormSubmission}>
					<div className='d-flex gap-3 align-items-end'>
						<Form.Group className='flex-grow-1'>
							<Form.Control 
								type="text" 
								name="query" 
								value={input} 
								className='form-control' 
								placeholder='Batman'
								onChange={(event) => setInput(event.target.value)}
							/>
						</Form.Group>
						
						<div className="d-flex gap-2">
							{/* <Button type="submit" className='btn btn-primary w-100'>Search</Button> */}
							<Link to={"/?search="} className='btn btn-outline-light w-100'>Clear</Link>
						</div>
					</div>
				</Form>

				{/* MARK: GIF LIST */}
				<section className='mt-5'>
					<h2 className='mb-3 fs-4'>
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
												gifCardClasses='d-flex flex-basis'
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
						<section className='d-flex justify-content-center mt-5'>
							<Pagination>
								<Pagination.Prev linkClassName='bg-dark text-light' disabled={page - 1 === 0} href={`?search=${input}&p=${page - 1}`}/>
								<Pagination.Item linkClassName='bg-dark text-light' disabled>
									Page {page}
								</Pagination.Item>
								<Pagination.Next linkClassName='bg-dark text-light' href={`?search=${input}&p=${page + 1}`}/>
							</Pagination>
						</section>
					) : ''
				}
			</main>
    </>
  )
}

export default Home