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

  // Calculate duration from video data if available
  const getVideoDuration = (data: any): number => {
    if (data?.video && data.video.length > 0) {
      // Try to get duration from the first video variant
      const videoUrl = data.video[0]?.src;
      if (videoUrl) {
        // For now, use a default duration since we can't get it at runtime
        // In a real implementation, you might want to pre-calculate this
        return 9; // Default fallback
      }
    }
    return renderTime;
  };

  const videoDuration = tweetData ? getVideoDuration(tweetData) : renderTime;

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
