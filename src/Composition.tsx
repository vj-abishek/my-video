import {AbsoluteFill, Img, Sequence, Video, interpolate, staticFile, useCurrentFrame, Audio, getInputProps, random} from 'remotion';
import {Tweet} from './Tweet'
import {Notification} from './Notification';
import {z} from 'zod';
import { loadFont } from "@remotion/google-fonts/Roboto";

const { fontFamily } = loadFont();

export const myCompSchema = z.object({
	random: z.number(),
	data: z.object({}),
});

export const MyComposition: React.FC<z.infer<typeof myCompSchema>> = ({
	random,
	data
}) => {
	const frame = useCurrentFrame();
	const delay = 30;
	const opacity = interpolate(frame, [0 + delay, 60 + delay], [0, 1]);
	const contentOpacity = interpolate(frame, [0 + delay + 20, 120 + delay + 20], [0, 1]);


	return data ? (
		<AbsoluteFill className='bg-black' style={{ fontFamily }}>
			<AbsoluteFill>
			  <Video style={{
					opacity,
					filter: 'brightness(30%)'
				}} src={staticFile("video.mp4")} />
				<Audio startFrom={455} src={staticFile("audio.webm")} />
			</AbsoluteFill>
			<AbsoluteFill className='items-center justify-center'>
				<div style={{ opacity: contentOpacity }} className="m-10" />
					{/* <Logo logoColor={propThree} /> */}
					{ data && (<Notification data={data} />)}
					<div className="m-3" />
					<Tweet data={data} />
					{/* <Title titleT ext={propOne} titleColor={propTwo} /> */}
					{/* <Subtitle /> */}
			</AbsoluteFill>
		</AbsoluteFill>
	) : null
};
