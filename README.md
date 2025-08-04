# Remotion video with Tailwind

<p align="center">
  <a href="https://github.com/remotion-dev/logo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-dark.gif">
      <img alt="Animated Remotion Logo" src="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-light.gif">
    </picture>
  </a>
</p>

Welcome to your Remotion project!

## Commands

**Install Dependencies**

```console
yarn
```

**Start Preview**

```console
yarn start
```

**Render video**

```console
yarn build
```

**Upgrade Remotion**

```console
yarn run upgrade
```

## Using fetch.sh to render tweet videos

The `./fetch.sh` script allows you to fetch tweet data and render videos with custom settings.

### Usage

```bash
./fetch.sh <tweet_id>
```

### Example

```bash
./fetch.sh 1951436233248301540
```

### Interactive Prompts

When you run the script, it will prompt you for:

1. **Render Time**: Enter the total time to render in seconds (default: 9)
2. **Music**: Choose whether to include background music (y/n, default: y)
3. **Render Mode**: Choose between tweet card or video-only mode (tweet/video, default: tweet)

### Example Session

```bash
$ ./fetch.sh 1951436233248301540
Enter total time to render (in seconds, default: 9): 30
Include background music? (y/n, default: y): n
Render with tweet card or only video? (tweet/video, default: tweet): video
Fetching tweet data for ID: 1951436233248301540
Render time: 30s
Include music: n
Render mode: video
```

### Render Modes

#### Tweet Mode (default)
- Shows the tweet card with user info and text
- Background video with white noise overlay
- Full tweet content display

#### Video-Only Mode
- Renders only the video in fullscreen
- No tweet card or backdrop
- Clean video-only output
- Perfect for video-focused content

### Features

- **Dynamic Video Selection**: Automatically selects the best video quality from available variants
- **Custom Duration**: Set your own render time or use the video's actual duration
- **Music Control**: Choose whether to include background music
- **Render Modes**: Choose between tweet card or video-only rendering
- **Tweet Integration**: Fetches real tweet data and renders it as a video

### Requirements

- `ffmpeg` installed for video duration detection
- `jq` installed for JSON processing
- Internet connection for fetching tweet data

## Using server-side rendering

This template uses a [custom Webpack override](https://www.remotion.dev/docs/webpack). If you are using server-side rendering, you need to import the override function from `./src/webpack-override.ts` and pass it to [`bundle()`](https://www.remotion.dev/docs/bundle) (if using SSR) and [`deploySite()`](https://www.remotion.dev/docs/lambda/deploysite) (if using Lambda).

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

Get started with Tailwind by reading the ["Utility first" page](https://tailwindcss.com/docs/utility-first)

## Help

We provide help [on our Discord server](https://remotion.dev/discord).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Note that for some entities a company license is needed. Read [the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
