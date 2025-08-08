/* eslint-disable react/no-danger */
import { Img, OffthreadVideo, interpolate, random, useCurrentFrame } from "remotion"

interface TweetProps {
  data: any;
}

export const Tweet: React.FC<TweetProps> = ({ data }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [10, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const getSrc = (urls: { src: string }[]) => {
    const sizes = ['1280x', '720x', '480x', 'x720', 'x480', 'x360','x850', '540x'];

    for (const size of sizes) {
      const url = urls.find((d) => d.src.includes(size));
      if (url) {
        return url.src;
      }
    }
    
    return urls[urls.length - 1].src;
  }

  return (
    <div className="w-[87%] m-9 bg-white border-[#eff3f4] p-10 rounded-[40px]">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center">
          <div className="shrink-0">
            <Img src={data.avatar} className="w-28 h-28 rounded-full" />
          </div>
          <div className="ml-6">
            <p className="text-4xl font-bold">{data.name}</p>
            <span className="text-3xl">@{data.username}</span>
          </div>
        </div>
        <div>
          <Img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZM74c7u5dbdDk0mtxAmUOXQpyAHkMFB9HUVYKLOqAbQ&s" className="w-28 h-28 rounded-full" />
        </div>
      </div>


      <div className="flex flex-row mb-4">
        <div dangerouslySetInnerHTML={{ __html: data.text }} className="mt-12 text-5xl" style={{ lineHeight: '63px' }} />      </div>

      {data.video ? (
        <div className="mt-12">
          <OffthreadVideo
            src={getSrc(data.video)}
            muted
            className="rounded-3xl aspect-auto bg-black w-full border-[#eff3f4]"
          />
        </div>
      ) : (
        data.images.length ? (
          <Img className="rounded-3xl aspect-auto bg-slate-300 object-cover w-full border-[#eff3f4]" src={data.images[0]} />
        ) : null
      )}

      <div className="flex flex-row text-2xl mt-8 text-[#536471]">
        <div>{data.createdAt}</div>
      </div>
    </div>
  )
}