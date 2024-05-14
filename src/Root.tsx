import {Composition, getInputProps, random} from 'remotion';
import {MyComposition, myCompSchema} from './Composition';
import './style.css';

export const RemotionRoot: React.FC = () => {
  const data = getInputProps();
	console.log(data)

	return data.tweet ? (
		<>
			<Composition
				id="YTShorts"
				component={MyComposition}
				durationInFrames={2070}
				fps={30}
				width={1080}
				height={1920}
				schema={myCompSchema}
				defaultProps={{
					 random: random(data.tweet.avatar),
					 data: data.tweet
				}}
			/>
		</>
	) : null
};
