import Image from "next/image";
import Avatar from "../../../../public/images/avatar.png";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Mesurments({
  measurements,
  attributes,
  setMeasurements,
}: any) {
  const [skinTone, setSkinTone] = useState([
    { key: "skin_tone_1", hex: "#f6ede4" },
    { key: "skin_tone_2", hex: "#f3e7db" },
    { key: "skin_tone_3", hex: "#f7ead0" },
    { key: "skin_tone_4", hex: "#eadaba" },
    { key: "skin_tone_5", hex: "#d7bd96" },
    { key: "skin_tone_6", hex: "#a07e56" },
    { key: "skin_tone_7", hex: "#825c43" },
    { key: "skin_tone_8", hex: "#604134" },
    { key: "skin_tone_9", hex: "#3a312a" },
    { key: "skin_tone_10", hex: "#292420" },
  ]);

  console.log(attributes);

  const [selectedSkinToneIndex, setSelectedSkinToneIndex] = useState(1);

  const handlePrevSkinTone = () => {
    setSelectedSkinToneIndex((prev) =>
      prev === 0 ? skinTone.length - 1 : prev - 1
    );
  };

  const handleNextSkinTone = () => {
    setSelectedSkinToneIndex((prev) =>
      prev === skinTone.length - 1 ? 0 : prev + 1
    );
  };

  const updateValue = (index: number, delta: number) => {
    setMeasurements((prev: any[]) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, value: Math.max(0, (item.value || 0) + delta) }
          : item
      )
    );
  };

  return (
    <>
      <div className="flex flex-col gap-[0.75rem]">
        <div className="text-[1.5rem] font-semibold">
          We’ve measured your body
        </div>
        <div className="text-[1rem]">
          Take a look to make sure everything looks right. You can adjust the
          measurements if needed.
        </div>
      </div>

      <div className="flex mt-[2.3rem]">
        {/* Left: Avatar + Scanline */}
        <div className="w-[50%] h-[350px] relative bg-[url('/radial_gradient_bg.svg')] bg-cover bg-center flex items-center justify-center overflow-hidden group">
          <Image
            alt="Avatar"
            height={100}
            width={150}
            src={Avatar}
            className="relative z-10"
          />

          <div className="absolute inset-0 z-20 pointer-events-none">
            <div
              className="absolute left-0 top-0 w-full h-full animate-scanline"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 0%, rgba(0,255,204,0.12) 45%, rgba(0,255,204,0.15) 55%, transparent 100%)",
                filter: "blur(8px)",
                maskImage: `
                  radial-gradient(farthest-side at 50% 50%, black 60%, transparent 100%)
                `,
                WebkitMaskImage: `
                  radial-gradient(farthest-side at 50% 50%, black 60%, transparent 100%)
                `,
              }}
            />
          </div>
        </div>

        {/* Right: Measurements & Skin Tone */}
        <div className="w-[50%] max-h-[38vh] overflow-scroll scrollbar-hide">
          {measurements && (
            <div className="flex flex-col gap-[0.5rem]">
              {measurements?.map((measurement: any, index: any) => (
                <div
                  key={index}
                  className="p-[0.5rem] bg-[#212121CC] rounded-[0.95rem] h-[4rem]"
                >
                  <div className="text-white text-[0.634rem] font-bold">
                    {measurement.key
                      ?.split("_")
                      .map(
                        (word: any) =>
                          word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex items-baseline gap-1">
                      <div className="text-[1.5rem] text-[#3AAEF8]">
                        {Number((measurement as any)?.value).toFixed(2)}
                      </div>
                      <div className="text-[0.5rem] text-[#8A8B8F]">
                        {measurement.unit}
                      </div>
                    </div>
                    <div className="flex gap-[0.5rem]">
                      <button
                        onClick={() => updateValue(index, -1)}
                        className="bg-[linear-gradient(0deg,rgba(0,0,0,0.14)_0%,rgba(0,0,0,0.14)_100%),linear-gradient(124deg,#9F62ED_-4.44%,#3AAEF8_139.98%)] rounded-full w-[2.135rem] h-[1.5rem] flex items-center justify-center text-white text-lg"
                      >
                        –
                      </button>
                      <button
                        // onClick={() => updateValue(index, 1)}
                        className="bg-[linear-gradient(0deg,rgba(0,0,0,0.14)_0%,rgba(0,0,0,0.14)_100%),linear-gradient(124deg,#9F62ED_-4.44%,#3AAEF8_139.98%)] rounded-full w-[2.135rem] h-[1.5rem] flex items-center justify-center text-white text-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Skin Tone Card */}
              <div className="p-[0.5rem] bg-[#212121CC] rounded-[0.95rem] h-[4rem] flex flex-col justify-between">
                <div className="text-white text-[0.634rem] font-bold">
                  Skin tone
                </div>
                <div className="flex items-center justify-between">
                  {/* Skin tone swatch on the left */}
                  <div
                    style={{
                      backgroundColor: skinTone[selectedSkinToneIndex].hex,
                    }}
                    className="h-6 w-10 rounded-lg"
                  />

                  {/* Buttons on the right */}
                  <div className="flex gap-[0.5rem]">
                    <button
                      onClick={handlePrevSkinTone}
                      className="bg-[linear-gradient(0deg,rgba(0,0,0,0.14)_0%,rgba(0,0,0,0.14)_100%),linear-gradient(124deg,#9F62ED_-4.44%,#3AAEF8_139.98%)] rounded-full w-[2.135rem] h-[1.5rem] flex items-center justify-center text-white"
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      onClick={handleNextSkinTone}
                      className="bg-[linear-gradient(0deg,rgba(0,0,0,0.14)_0%,rgba(0,0,0,0.14)_100%),linear-gradient(124deg,#9F62ED_-4.44%,#3AAEF8_139.98%)] rounded-full w-[2.135rem] h-[1.5rem] flex items-center justify-center text-white"
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
