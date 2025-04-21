"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hideTagline, setHideTagline] = useState(false);

  const tagline = "Your Personal AI Stylist";

  useEffect(() => {
    const splashDuration = 1500;

    const timeout = setTimeout(() => {
      // Trigger tagline disappearance first
      setHideTagline(true);

      // Then after animation is done, trigger logo move up
      setTimeout(() => {
        setIsLoaded(true);
      }, tagline.length * 50 + 500); // wait for tagline animation
    }, splashDuration);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-[#4B3F91] via-[#3D5AAB] to-[#2B4C77]">
      {/* Logo */}
      <div
        className={`absolute text-white text-4xl font-bold transition-all duration-1000 ease-in-out
          ${
            isLoaded
              ? "top-6 left-6 scale-75"
              : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          }
        `}
      >
        STYLLAR
      </div>

      {/* Tagline */}
      {!isLoaded && (
        <div className="absolute top-[calc(50%+2rem)] left-1/2 -translate-x-1/2 flex gap-[1px] text-white text-lg font-medium">
          {tagline.split("").map((char, i) => (
            <span
              key={i}
              className={`inline-block transition-all duration-500 ease-in-out`}
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

      {/* Main content */}
      {isLoaded && (
        <div className="p-8 text-white">
          <h1 className="text-2xl mt-24"></h1>
        </div>
      )}
    </div>
  );
}
