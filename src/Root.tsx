import {Composition, getInputProps, random} from 'remotion';
import {MyComposition, myCompSchema} from './Composition';
import './style.css';

interface Props {
  tweet?: any;
  renderTime?: number;
  includeMusic?: boolean;
  videoOnly?: boolean;
}

export const RemotionRoot: React.FC = () => {
  const props = getInputProps() as Props;
  
  // Handle both old and new prop structures
  const tweetData = props.tweet;
  const renderTime = props.renderTime || 9;
  const includeMusic = props.includeMusic !== undefined ? props.includeMusic : true;
  const videoOnly = props.videoOnly !== undefined ? props.videoOnly : false;

  // Use renderTime for duration calculation
  const videoDuration = renderTime;

	return tweetData ? (
		<>
			<Composition
				id="YTShorts"
				component={MyComposition}
				durationInFrames={Math.floor(videoDuration * 30)} // Convert seconds to frames at 30fps
				fps={30}
				width={1080}
				height={1920}
				schema={myCompSchema}
				defaultProps={{
					 random: random(tweetData.avatar),
					 data: tweetData,
					 renderTime: renderTime,
					 includeMusic: includeMusic,
					 videoOnly: videoOnly
				}}
			/>
		</>
	) : null
};
