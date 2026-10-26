import { useState, useEffect } from 'react';
import { fetchRandomGifs, fetchQueryGifs } from '../services/giphyService';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { Form } from 'react-bootstrap';

import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../../node_modules/bootstrap-icons/font/bootstrap-icons.css";
import GifCard from '../components/gifCard';
import type GifModel from '../models/gifModel';

function Home() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [input, setInput] = useState<string>();
	const [gifs, setGifs] = useState<any[]>([]);
	const query = searchParams.get("search") ?? "";

	console.log(query, "query");

	let timeoutId = 0;

	useEffect(() => {
		if (!input) return;

		timeoutId = setTimeout(
			() => setSearchParams(
				{search: input}
			), 
			1500
		);

		return () => clearTimeout(timeoutId)
	}, [input, query, searchParams])

	useEffect(() => {
		setInput(query);
	}, [query])

	useEffect(() => {
		if (!searchParams.has("search")) setSearchParams(
			{search: '' },
			{replace: true}
		);
	}, [])

	useEffect(() => {
		document.title = query ? `Gif Picker - ${query}` : 'Gif Picker';
	}, [query]);

	useEffect(() => {
		const controller = new AbortController();

		async function loadGifs() {
			let results = (query) 
				? await fetchQueryGifs(query, 16, controller)
				: await fetchRandomGifs(3, controller)

			setGifs(results);

			console.log(results);
		}

		loadGifs();
		
		return () => controller.abort();
	}, [query]);

	// console.log(gifs);

  return (
    <>
			<main style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 20px"}} className='pt-3 pb-5'>	
				<h3 className='fs-5 text-secondary'>Hi There!</h3>
				<h1 className=" fs-3 mb-3">Welcome to Gif Picker</h1>

				<p>Type in the search bar below, then wait. Your GIFs will appear shortly.</p>

				<Form>
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
							<Link to={"/?search="} className='btn btn-outline-secondary w-100'>Clear</Link>
						</div>
					</div>
				</Form>

				<section className='mt-5'>
					<h2 className='mb-3 fs-4'>
						{
							query 
							? `Gifs For ${query}`
							: "Not Sure What to Look for? Try These Out!"
						}
					</h2>

					<div 
						style={{
							display: "grid", 
							gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
							gap: "10px"
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
				</section>
			</main>
    </>
  )
}

export default Home