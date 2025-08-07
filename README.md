# My Video Project

A video generation application using Remotion for video creation and Fresh (Deno) for the web interface.

## Project Structure

- `video-ui/` - Fresh (Deno) web application
- `videos/` - Remotion video generation project
- `videos/backend/` - Node.js proxy server

## Issues Fixed

### Dockerfile Issues
- ✅ Fixed Deno PATH setup for all users
- ✅ Added yarn installation (matching package.json configuration)
- ✅ Installed dependencies for both video-ui and backend
- ✅ Exposed both required ports (8000 and 7645)
- ✅ Created startup script to run both services

### Configuration Issues
- ✅ Added .dockerignore for optimized builds
- ✅ Created docker-compose.yml for easier development
- ✅ Consistent package manager usage (yarn for videos, npm for backend)

## Quick Start

### Using Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up --build

# For development with volume mounts
docker-compose up dev
```

### Using Docker directly

```bash
# Build the image
docker build -t my-video .

# Run the container
docker run -p 8000:8000 -p 7645:7645 my-video
```

## Services

- **Fresh App**: http://localhost:8000
- **Backend Proxy**: http://localhost:7645

## Development

### Local Development (without Docker)

1. **Start the backend proxy:**
   ```bash
   cd videos/backend
   npm install
   node index.js
   ```

2. **Start the Fresh app:**
   ```bash
   cd video-ui
   deno task start
   ```

3. **Start Remotion studio:**
   ```bash
   cd videos
   yarn install
   yarn start
   ```

## Security Notes

⚠️ **Important**: The backend proxy currently disables SSL verification (`secure: false`). This should be changed in production environments.

## Environment Variables

Consider adding these environment variables for production:

```bash
NODE_ENV=production
API_TARGET=https://api.brandbird.app
FRESH_PORT=8000
BACKEND_PORT=7645
```

## Troubleshooting

1. **Port conflicts**: Make sure ports 8000 and 7645 are available
2. **Deno not found**: Ensure Deno is properly installed and in PATH
3. **Dependencies**: Run `yarn install` in videos/ and `npm install` in videos/backend/ 