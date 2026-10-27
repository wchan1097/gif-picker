import type GifModel from '../models/gifModel';
import "../App.css";

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
	// const [showToast, setShowToast] = useState<boolean>(false);

	async function copyGif (gifUrl: string): Promise<void> {
		try {
			await navigator.clipboard.writeText(gifUrl)
			alert("Your Gif has been copied!");
		} catch (error) {
			// Unable to copy gif URL
		}
	}

	return (
		<div style={{ display: "flex" }}>
			<div
			style={{
				display: "flex",
				width: "100%",
				overflow: "hidden", 
				borderRadius: "10px",
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
						className='btn-outline-white'
						style={{ backgroundColor: "rgba(10, 10, 10, .5)" }} 
						onClick={() => copyGif(gifModel.web_url)}
					>
						Copy
					</button>
				</div>
			</div>
		</div>
	)
}

export default GifCard;