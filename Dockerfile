FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN echo "Acquire::http::Pipeline-Depth 0;" > /etc/apt/apt.conf.d/99custom && \
    echo "Acquire::http::No-Cache true;" >> /etc/apt/apt.conf.d/99custom && \
    echo "Acquire::BrokenProxy    true;" >> /etc/apt/apt.conf.d/99custom

# Install Deno, Node, and other tools
RUN apt-get update && \
    apt-get install -y curl git gnupg bash unzip ca-certificates ffmpeg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install NVM and Node.js
ENV NVM_DIR=/root/.nvm
ENV NODE_VERSION=20.11.0

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash && \
    . "$NVM_DIR/nvm.sh" && \
    nvm install $NODE_VERSION && \
    nvm use $NODE_VERSION && \
    nvm alias default $NODE_VERSION

# Add NVM and Node.js to PATH
ENV PATH="$NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH"

# Install Deno
RUN curl -fsSL https://deno.land/x/install/install.sh | sh

ENV DENO_INSTALL=/root/.deno
ENV PATH="${DENO_INSTALL}/bin:${PATH}"

# Set work directory
WORKDIR /app

# Copy all files
COPY . .

# Install remotion dependencies
RUN cd videos && npm ci

# Change to video-ui directory
WORKDIR /app/video-ui

# Expose Fresh default port
EXPOSE 8000

# Run the Fresh app
CMD ["deno", "task", "start"]
