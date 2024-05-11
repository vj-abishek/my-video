/* eslint-disable react/no-danger */
import { Img, Video, interpolate, random, useCurrentFrame } from "remotion"

export const Tweet = ({ data }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const getSrc = (urls: { src: string }[]) => {
    const sizes = ['1280x', '720x', '480x', 'x720', 'x480', 'x360'];

    for (const size of sizes) {
      const url = urls.find((d) => d.src.includes(size));
      if (url) {
        return url.src;
      }
    }
  }

  return (
    <div style={{ opacity }} className="w-[92%] m-9 bg-white border-[#eff3f4] p-10 rounded-[40px]">
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
          <Video
            loop
            src={getSrc(data.video)}
            className="rounded-3xl aspect-video w-full border-[#eff3f4]"
            volume={0}
          />
        </div>
      ) : (
        data.images.length ? (
          <Img className="rounded-3xl aspect-video object-cover w-full border-[#eff3f4]" src={data.images[0]} />
        ) : null
      )}

      <div className="flex flex-row text-2xl mt-8 text-[#536471]">
        <div>{data.createdAt}</div>
      </div>
    </div>
  )
}