import Image from "next/image";
import Avatar from "../../../../public/images/avatar.png";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function Mesurments({
  measurements,
  attributes,
  setMeasurements,
  image,
}: any) {
  useEffect(() => {}, []);

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

      <div className="flex mt-[2.3rem] h-full">
        {/* Left: Avatar + Scanline */}
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className={`relative bg-[url('/radial_gradient_bg.svg')] bg-cover bg-center flex items-center justify-center overflow-hidden group ${
            measurements[0].value !== null
              ? "w-[50%] h-[350px]"
              : "w-full h-[50vh]"
          } `}
        >
          <Image
            alt="Avatar"
            height={100}
            width={150}
            src={
              Avatar
              // image != null
              //   ? `https://demo.styllar.ai/api/files/${image}`
              //   : Avatar
            }
            className={`relative z-10 h-full ${
              measurements[0].value == null && "w-[60%]"
            } `}
          />

          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: "100%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(0,255,204,0.12) 45%, rgba(0,255,204,0.15) 55%, transparent 100%)",
              filter: "blur(8px)",
              maskImage:
                "radial-gradient(farthest-side at 50% 50%, black 60%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(farthest-side at 50% 50%, black 60%, transparent 100%)",
            }}
          />
        </motion.div>

        {/* Right: Measurements & Skin Tone */}
        <AnimatePresence>
          {measurements[0].value !== null && (
            <motion.div
              key="measurement-panel"
              layout
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-[50%] max-h-[38vh] overflow-scroll scrollbar-hide"
            >
              <div className="flex flex-col gap-[0.5rem]">
                {measurements.map((measurement: any, index: any) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
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
                          {Number(measurement?.value).toFixed(2)}
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
                          onClick={() => updateValue(index, 1)}
                          className="bg-[linear-gradient(0deg,rgba(0,0,0,0.14)_0%,rgba(0,0,0,0.14)_100%),linear-gradient(124deg,#9F62ED_-4.44%,#3AAEF8_139.98%)] rounded-full w-[2.135rem] h-[1.5rem] flex items-center justify-center text-white text-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Skin Tone Card */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: measurements.length * 0.05 }}
                  className="p-[0.5rem] bg-[#212121CC] rounded-[0.95rem] h-[4rem] flex flex-col justify-between"
                >
                  <div className="text-white text-[0.634rem] font-bold">
                    Skin tone
                  </div>
                  <div className="flex items-center justify-between">
                    <div
                      style={{
                        backgroundColor: skinTone[selectedSkinToneIndex].hex,
                      }}
                      className="h-6 w-10 rounded-lg"
                    />
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
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
