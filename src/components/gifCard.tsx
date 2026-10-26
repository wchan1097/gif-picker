import { useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import type GifModel from '../models/gifModel';

interface GifCardProps {
	gifModel: GifModel,
	key: string,
	gifCardClasses?: string
}

function GifCard ({
	gifModel,
	gifCardClasses
}: GifCardProps) {
	const gifImageData = gifModel.image;
	const [showToast, setShowToast] = useState<boolean>(false);

	async function copyGif (gifUrl: string): Promise<void> {
		try {
			await navigator.clipboard.writeText(gifUrl)
			setShowToast(true);
		} catch (error) {
			// Unable to copy gif URL
		}
	}

	return (
		<div className={gifCardClasses}>
			<div 
			className='rounded overflow-hidden w-100 d-flex align-items-center' 
			style={{
				position: "relative", 
				backgroundColor: "black"
			}}>
				<video
					style={{width: "100%"}}
					autoPlay 
					playsInline 
					loop 
					muted
				>
					<source src={gifImageData.url} type="video/mp4"></source>
				</video>

				<div style={{position: "absolute", bottom: "10px", left: "10px"}}>
					<button  
						title="Copy Gif"
						type="button" 
						className='btn btn-outline-light btn-sm text-white' 
						style={{ backgroundColor: "rgba(10, 10, 10, .5)"}} 
						onClick={() => copyGif(gifModel.web_url)}
					>
						<i className='bi bi-copy'></i>
					</button>
				</div>
			</div>

			<ToastContainer position="bottom-center" className='my-3'>
				<Toast 
					show={showToast} 
					delay={3000} 
					autohide 
					onClose={() => setShowToast(false)}
					bg='success'
				>
					<Toast.Body>
						<div className='text-center text-white'>Your Gif has been copied!</div>
					</Toast.Body>
				</Toast>
			</ToastContainer>
		</div>
	)
}

export default GifCard;