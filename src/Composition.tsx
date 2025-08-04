import {AbsoluteFill, Video, interpolate, staticFile, useCurrentFrame, Audio, useVideoConfig} from 'remotion';
import {Tweet} from './Tweet'
import {z} from 'zod';
import { loadFont } from "@remotion/google-fonts/Roboto";

const { fontFamily } = loadFont();

interface TweetData {
	video?: { src: string }[];
	[key: string]: any;
}

export const myCompSchema = z.object({
	random: z.number(),
	data: z.object({}).refine((data): data is TweetData => true),
	renderTime: z.number().optional(),
	includeMusic: z.boolean().optional(),
	videoOnly: z.boolean().optional(),
});

// White noise component using SVG
const WhiteNoise: React.FC = () => {
	const frame = useCurrentFrame();
	const { width, height } = useVideoConfig();
	
	// Create SVG noise pattern
	const noisePattern = `
		<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<filter id="noise">
					<feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/>
					<feColorMatrix type="saturate" values="0"/>
				</filter>
			</defs>
			<rect width="100%" height="100%" filter="url(#noise)" opacity="0.1"/>
		</svg>
	`;
	
	return (
		<AbsoluteFill
			style={{
				backgroundImage: `url("data:image/svg+xml;base64,${btoa(noisePattern)}")`,
				backgroundSize: 'cover',
				opacity: 0.08,
				pointerEvents: 'none',
			}}
		/>
	);
};

export const MyComposition: React.FC<z.infer<typeof myCompSchema>> = ({
	random,
	data,
	renderTime = 9,
	includeMusic = true,
	videoOnly = false
}) => {
	const frame = useCurrentFrame();

	// Get video URL using the same logic as Tweet component
	const getVideoSrc = (urls: { src: string }[]) => {
		const sizes = ['1280x', '720x', '480x', 'x720', 'x480', 'x360','x850', '540x'];

		for (const size of sizes) {
			const url = urls.find((d) => d.src.includes(size));
			if (url) {
				return url.src;
			}
		}
		
		return urls[urls.length - 1].src;
	};

	// Get video URL from tweet data
	const videoUrl = data.video ? getVideoSrc(data.video) : null;

	// If video-only mode, render just the video in fullscreen
	if (videoOnly && videoUrl) {
		return (
			<AbsoluteFill>
				<Video 
					style={{
						objectFit: 'cover',
						width: '100%',
						height: '100%'
					}} 
					src={videoUrl} 
				/>
				{includeMusic && (
					<Audio src={staticFile("audio.mp3")} volume={0.4} />
				)}
			</AbsoluteFill>
		);
	}

	// Regular tweet mode with backdrop and tweet card
	return data ? (
		<AbsoluteFill className='bg-black' style={{ fontFamily }}>
			<AbsoluteFill>
				{videoUrl ? (
					<Video 
						style={{
							filter: 'brightness(30%)',
							objectFit: 'cover',
							width: '100%',
							height: '100%'
						}} 
						src={videoUrl} 
					/>
				) : (
					<Video 
						style={{
							filter: 'brightness(30%)',
							objectFit: 'cover',
							width: '100%',
							height: '100%'
						}} 
						src={staticFile("video.mp4")} 
					/>
				)}
				{/* White noise overlay */}
				<WhiteNoise />
				{includeMusic && (
					<Audio src={staticFile("audio.mp3")} volume={0.4} />
				)}
			</AbsoluteFill>
			<AbsoluteFill className='items-center justify-center'>
				<div className="m-10" />
				<div className="m-3" />
				<Tweet data={data} />
			</AbsoluteFill>
		</AbsoluteFill>
	) : null
};
