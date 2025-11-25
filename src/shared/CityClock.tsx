import { FC, useState, useEffect } from "react";

interface CityClockProps {
  city: string;
}

const CityClock: FC<CityClockProps> = ({ city }) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="pt-8 pb-4 sm:py-8 sm:max-w-6xl w-full sm:mx-auto px-4 sm:px-8">
      <div className="flex flex-col items-center justify-center text-white font-dela-gothic-one font-bold">
        <span className="mb-0 font-montserrat-bolder text-[0.8rem] 2xl:text-[1.2rem]">
          {city}, Estonia
        </span>
        <h1 className="text-2xl 2xl:text-[2.4rem]">
          {currentTime.toLocaleTimeString("en-GB", {
            timeZone: "Europe/Tallinn",
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </h1>
        <div className="mt-4 w-60 xs:w-100 md:w-150 lg:w-160 2xl:w-260 border-t-2 border-[#E4DD3B]"></div>
      </div>
    </div>
  );
};

export default CityClock;
