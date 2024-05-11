#!/bin/bash

# Check if ID parameter is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <tweet_id> <output_file>"
    exit 1
fi

# Tweet ID parameter
tweet_id="$1"

# Output file
output_file="output.json"

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
    # npx remotion studio --props='./output.json'
    npx remotion render 'src/index.ts' YTShorts --props='./output.json'

else
    echo "Failed to fetch data"
fi
