#!/bin/bash

# Check if ID parameter is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <tweet_id>"
    exit 1
fi

# Tweet ID parameter
tweet_id="$1"

# Output file
output_file="output.json"

# Ask for render time
echo "Enter total time to render (in seconds, default: 9):"
read -r render_time
render_time=${render_time:-9}

# Ask if music should be included
echo "Include background music? (y/n, default: y):"
read -r include_music
include_music=${include_music:-y}

# Ask if render with tweet or only video
echo "Render with tweet card or only video? (tweet/video, default: tweet):"
read -r render_mode
render_mode=${render_mode:-tweet}

# Convert to boolean for JavaScript
if [[ "$include_music" == "y" || "$include_music" == "Y" ]]; then
    music_enabled="true"
else
    music_enabled="false"
fi

# Convert render mode to boolean
if [[ "$render_mode" == "video" ]]; then
    video_only="true"
else
    video_only="false"
fi

echo "Fetching tweet data for ID: $tweet_id"
echo "Render time: ${render_time}s"
echo "Include music: $include_music"
echo "Render mode: $render_mode"

# Curl command with headers and URL
curl "https://api.brandbird.app/twitter/public/tweets/$tweet_id" \
  -H 'sec-ch-ua: "Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"' \
  -H 'Accept: application/json, text/plain, */*' \
  -H 'Referer: https://www.brandbird.app/' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'Authorization: JWT null' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -o "$output_file"

# Check if curl was successful
if [ $? -eq 0 ]; then
    echo "Data successfully fetched and saved to $output_file"
    
    # Create a temporary props file with the additional parameters
    cat > temp_props.json << EOF
{
  "renderTime": $render_time,
  "includeMusic": $music_enabled,
  "videoOnly": $video_only,
  "tweet": $(cat "$output_file" | jq -r '.tweet')
}
EOF
    
    # Render with the enhanced props
    npx remotion render 'src/index.ts' YTShorts --props='./temp_props.json'
    
    # Clean up temporary file
    # rm temp_props.json
else
    echo "Failed to fetch data"
    exit 1
fi
