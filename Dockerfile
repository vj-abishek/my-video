FROM node:22-bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive

RUN echo "Acquire::http::Pipeline-Depth 0;" > /etc/apt/apt.conf.d/99custom && \
    echo "Acquire::http::No-Cache true;" >> /etc/apt/apt.conf.d/99custom && \
    echo "Acquire::BrokenProxy    true;" >> /etc/apt/apt.conf.d/99custom && \
    echo "Acquire::Retries 5;" >> /etc/apt/apt.conf.d/99custom

# Install Chrome dependencies and security updates
RUN apt-get update && apt-get upgrade -y
RUN apt install -y \
  libnss3 \
  libdbus-1-3 \
  libatk1.0-0 \
  libgbm-dev \
  libasound2 \
  libxrandr2 \
  libxkbcommon-dev \
  libxfixes3 \
  libxcomposite1 \
  libxdamage1 \
  libatk-bridge2.0-0 \
  libpango-1.0-0 \
  libcairo2 \
  libcups2 \
  curl \
  git \
  jq \
  unzip \
  build-essential \
  ffmpeg 
# Clean up to reduce image size
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Make sure Puppeteer/Remotion uses system Chrome
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome

# Set work directory
WORKDIR /app

# Copy all files
COPY . .

# Install remotion dependencies
RUN cd videos && yarn install --frozen-lockfile

# Install Chrome
RUN cd videos && npx remotion browser ensure

# Change to video-ui directory
WORKDIR /app/video-ui   

RUN npm install -g deno

# Build the Fresh app
RUN deno task manifest
RUN deno task build

# Expose Fresh default port
EXPOSE 8000

RUN deno cache main.ts

CMD ["deno", "run", "-A", "main.ts"]
