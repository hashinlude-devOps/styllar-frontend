"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoaded(true);
    }, 1500); // splash duration in ms
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-[#4B3F91] via-[#3D5AAB] to-[#2B4C77]">
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

      {isLoaded && (
        <div className="p-8 text-white">
          {/* Your main content here */}
          <h1 className="text-2xl mt-24"></h1>
        </div>
      )}
    </div>
  );
}
