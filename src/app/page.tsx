"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hideTagline, setHideTagline] = useState(false);

  const tagline = "Your Personal AI Stylist";

  useEffect(() => {
    const splashDuration = 1500;

    const timeout = setTimeout(() => {
      setHideTagline(true);
      setTimeout(() => {
        setIsLoaded(true);
      }, tagline.length * 50 + 500);
    }, splashDuration);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-[#4B3F91] via-[#3D5AAB] to-[#2B4C77]">
      <div
        className={`absolute transition-all duration-1000 ease-in-out
          ${
            isLoaded
              ? "top-4 left-1/2 -translate-x-1/2 scale-75"
              : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          }
          text-white text-center font-montserrat font-medium
          text-[2.2rem] sm:text-[2.5rem] md:text-[3rem]
          tracking-[1.2rem] sm:tracking-[1.5rem] md:tracking-[1.8rem]
        `}
      >
        STYLLAR
      </div>

      {!isLoaded && (
        <div
          className="absolute left-1/2 -translate-x-1/2 flex gap-[1px] 
          text-white font-medium uppercase font-montserrat
          text-[0.625rem] sm:text-[0.75rem] md:text-[0.875rem]
          tracking-[0.35rem] sm:tracking-[0.45rem] md:tracking-[0.525rem]
          top-[calc(50%+2.5rem)] sm:top-[calc(50%+3rem)]"
        >
          {tagline.split("").map((char, i) => (
            <span
              key={i}
              className="inline-block transition-all duration-500 ease-in-out"
              style={{
                transitionDelay: `${i * 50}ms`,
                opacity: hideTagline ? 0 : 1,
                transform: hideTagline ? "translateY(10px)" : "translateY(0)",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>
      )}

      {isLoaded && (
        <div className="max-width-wrapper text-white mt-24">
          <div className="flex flex-col gap-[1.5rem]">
            <h1 className="text-white text-[24px] font-semibold leading-[120%] tracking-[-0.03rem]">
              Hey there! <br /> We’re excited to style you.
            </h1>
            <p className="text-white text-[16px] font-normal leading-[140%]">
              What’s your name so we can make this personal?
            </p>

            <input
              type="text"
              placeholder="Name"
              className="flex max-w-[30rem] h-[3.5rem] px-5 py-4 flex-col justify-center items-start gap-1 rounded-[1rem] border border-[#8563ED] bg-[rgba(255,255,255,0.05)] text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#8563ED] focus:border-[#B49CFF] transition"
            />

            <input
              type="email"
              placeholder="Email"
              className="flex max-w-[30rem] h-[3.5rem] px-5 py-4 flex-col justify-center items-start gap-1 rounded-[1rem] border border-[#8563ED] bg-[rgba(255,255,255,0.05)] text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#8563ED] focus:border-[#B49CFF] transition"
            />
          </div>
        </div>
      )}
    </div>
  );
}
