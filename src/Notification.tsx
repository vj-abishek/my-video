import { useEffect, useState } from 'react';
import { Img, interpolate, random, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Notification = ({ data }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [currentJokes, setCurrentJokes] = useState<any>({});
  const translateY = spring({
    frame,
    fps,
    from: -10,
    to: 2,
    config: {
      damping: 200,
      stiffness: 100,
      mass: 0.5,
    },
  });

  const hide = spring({
    frame,
    fps,
    from: 1,
    to: 0,
    config: {
      damping: 200,
    },
    delay: 40,
  })

  const opacity = interpolate(frame, [0, 10, 50 * fps, 90 * fps], [0, 1, 1, 0]);
  const JOKES = [
    {
      title: "404 Error: Coffee Not Found ☕",
      description: "Status: Programmer not functioning",
      logo: "https://poopup.co/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgmail.f7309eb2.png&w=256&q=75"
    },
    {
      title: "New JavaScript Framework Alert 📣",
      description: "Framework: YetAnotherJSFramework.js",
      logo: "https://w7.pngwing.com/pngs/79/518/png-transparent-js-react-js-logo-react-react-native-logos-icon-thumbnail.png"
    },
    {
      title: "Code Review Requested 📝",
      description: "Repository: MyProject",
      logo: "https://w7.pngwing.com/pngs/646/324/png-transparent-github-computer-icons-github-logo-monochrome-head-thumbnail.png"
    },
    {
      title: "LinkedIn Connection: John Doe 🤝",
      description: "Position: Senior Developer at Google",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/600px-LinkedIn_logo_initials.png"
    },
    {
      title: "StackOverflow Reputation Increase",
      description: "Points: +200 🌟 ",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE6SdzLE0euEdbrbOEa_Kf4BSmHkVSCDgS7FFDtNH1QA&s"
    },
    {
      title: "Git Commit Denied ❌ ",
      description: 'Reason: Commit message "Fixed stuff"',
      logo: "https://w7.pngwing.com/pngs/646/324/png-transparent-github-computer-icons-github-logo-monochrome-head-thumbnail.png"
    },
    {
      title: "Action: Refill ASAP",
      description: "How do you expect to code without your fuel?",
      logo: "https://w7.pngwing.com/pngs/47/533/png-transparent-swiggy-office-business-online-food-ordering-delivery-bangalore-business-food-text-orange-thumbnail.png"
    },
    {
      title: "Traffic Jam Alert 🚦",
      description: "Duration: 2 hours",
      logo: "https://freelogopng.com/images/all_img/1659761297uber-icon.png"
    },
    ]

    useEffect(() => {
      console.log(data.avatar);
      const randomValues = random(data.avatar);
      console.log(randomValues)
      setCurrentJokes(JOKES[Math.floor(randomValues  * JOKES.length)]);
    }, []);

  return Object.keys(currentJokes).length ? (
    <div style={{
      top: `${translateY}%`,
      opacity: hide,
    }}
      className="fixed  left-1/2 transform -translate-x-1/2">
      <div className='w-[950px] mb-1 flex scale-100 items-start space-x-3 bg-gray-200/75 backdrop-blur p-10 pt-8 shadow-lg rounded-[10px] text-3xl z-50'>
        <div className="w-full">
          <div className='flex flex-row text-gray-700 leading-tight items-center'>
            <Img src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png" className="h-8" />
            <div className='ml-4'>YouTube</div>
            <div className='ml-2'>&#x2022;</div>
            <div className='ml-2'>1 minute ago</div>
          </div>
          <div style={{ opacity }} className="font-semibold text-gray-950 mt-5">{ currentJokes.title }</div>
          <div style={{ opacity }} className="font-normal text-gray-700 leading-tight mt-1">{ currentJokes.description }</div>
        </div>
        <div className="shrink-0">
          <Img src={currentJokes.logo} className="w-32 h-32 rounded-2xl" />
        </div>
      </div>
    </div>
  ) : null
}