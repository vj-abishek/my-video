import {Composition, getInputProps, random} from 'remotion';
import {MyComposition, myCompSchema} from './Composition';
import './style.css';

export const RemotionRoot: React.FC = () => {
  const data = getInputProps();

	return data.tweet ? (
		<>
			<Composition
				id="YTShorts"
				component={MyComposition}
				durationInFrames={240}
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
