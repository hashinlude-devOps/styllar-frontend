import { useEffect, useState, useRef } from "react";
import {
  getPredictions,
  getPredictionImages,
} from "../../../../lib/query/queries";
import Image from "next/image";

const tabs = ["Casual", "Office", "Party"];
const clothingKeys = ["bottom", "outerwear", "top"];

export default function Predictions({ mesurements, attributes, gender }: any) {
  const [activeTab, setActiveTab] = useState("Casual");
  const [predictions, setPredictions] = useState<any>(null);
  const [tabImages, setTabImages] = useState<Record<string, (string | null)[]>>(
    {
      casual: [null, null, null],
      office: [null, null, null],
      party: [null, null, null],
    }
  );
  const [currentSlide, setCurrentSlide] = useState(0);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const fetchAllPredictionsAndImages = async () => {
      const measurementObject = mesurements?.reduce((acc: any, item: any) => {
        acc[item.key] = item?.value;
        return acc;
      }, {});

      const attributeObject = attributes?.reduce((acc: any, item: any) => {
        acc[item.key] = item?.value;
        return acc;
      }, {});

      const pd = await getPredictions({
        ...measurementObject,
        ...attributeObject,
      });

      const imageMap: Record<string, (string | null)[]> = {
        casual: [],
        office: [],
        party: [],
      };

      for (const tab of tabs) {
        const key = tab.toLowerCase();
        const newImages = await Promise.all(
          clothingKeys.map(async (k) => {
            const text = pd.predictions[key][k];
            try {
              const result = await getPredictionImages({
                text: `For ${gender} ${text}`,
              });
              return result.images[0];
            } catch {
              return null;
            }
          })
        );
        imageMap[key] = newImages;
      }

      setPredictions(pd.predictions);
      setTabImages(imageMap);
      setCurrentSlide(0);
    };

    fetchAllPredictionsAndImages();
  }, [mesurements, attributes]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const diff = touchStartX.current - touchEndX.current;
    let newSlide = currentSlide;

    if (Math.abs(diff) > 50) {
      newSlide =
        diff > 0
          ? (currentSlide + 1) % clothingKeys.length
          : (currentSlide - 1 + clothingKeys.length) % clothingKeys.length;

      setCurrentSlide(newSlide);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentSlide(0);
  };

  const getTabKey = (tab: string) => tab.toLowerCase();

  const getSlideStyle = (index: number) => {
    const total = clothingKeys.length;
    const offset = (index - currentSlide + total) % total;
    const positions = [
      "translate-x-0", // center
      "-translate-x-32", // left
      "translate-x-32", // right
    ];
    return positions[offset];
  };

  return (
    <div className="flex flex-col items-center mt-4 text-white">
      {/* Tabs */}
      <div className="flex justify-center gap-8 mb-6">
        {tabs.map((tab) => (
          <div
            key={tab}
            className="flex flex-col items-center cursor-pointer"
            onClick={() => handleTabChange(tab)}
          >
            <span
              className={`text-lg ${
                activeTab === tab ? "font-semibold text-white" : "text-white"
              }`}
            >
              {tab}
            </span>
            <span
              className={`h-2 w-2 mt-1 rounded-full ${
                activeTab === tab ? "bg-white" : "bg-transparent"
              }`}
            />
          </div>
        ))}
      </div>

      {/* Image Slider */}
      <div
        className="relative h-[300px] w-full flex items-center justify-center mb-6 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {tabImages[getTabKey(activeTab)].map((img, idx) => {
          if (!img) return null;

          const isActive = idx === currentSlide;

          return (
            <div
              key={idx}
              className={`absolute transition-all duration-500 ease-in-out transform 
            ${getSlideStyle(idx)} 
            ${
              isActive
                ? "z-30 opacity-100 scale-110"
                : "z-10 opacity-40 scale-90"
            } 
            overflow-hidden`}
              style={{
                borderRadius: isActive ? 32 : 16,
              }}
            >
              <Image
                src={`https://demo.styllar.ai/api/files/${img}`}
                alt={`Prediction ${idx}`}
                width={isActive ? 260 : 200}
                height={isActive ? 200 : 160}
              />
            </div>
          );
        })}
      </div>

      {/* Text Slider */}
      {predictions && (
        <div className="w-full px-4 bg-[#21212180] p-5 rounded-[2rem]">
          <p className="text-sm text-center">
            {predictions[getTabKey(activeTab)][clothingKeys[currentSlide]]}
          </p>
        </div>
      )}
    </div>
  );
}
