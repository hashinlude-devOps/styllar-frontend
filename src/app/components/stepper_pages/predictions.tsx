import { useEffect, useState, useRef } from "react";
import {
  getPredictions,
  getPredictionImages,
} from "../../../../lib/query/queries";
import Image from "next/image";

const tabs = ["Casual", "Office", "Party"];
const clothingKeys = ["bottom", "outerwear", "top"];

export default function Predictions({ mesurements, attributes }: any) {
  const [activeTab, setActiveTab] = useState("Casual");
  const [prediction, setPrediction] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [images, setImages] = useState<(string | null)[]>([null, null, null]);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const fetchPredictionsAndImages = async () => {
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

      setPrediction(pd.predictions);

      const tabKey = getTabKey("Casual");
      const newImages = await Promise.all(
        clothingKeys.map(async (key) => {
          const text = pd.predictions[tabKey][key];
          try {
            const result = await getPredictionImages({ text });
            return result.images[0];
          } catch {
            return null;
          }
        })
      );
      setImages(newImages);
      setCurrentSlide(0);
    };

    fetchPredictionsAndImages();
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

  const handleTabChange = async (tab: string) => {
    setActiveTab(tab);
    setCurrentSlide(0);

    const tabKey = getTabKey(tab);
    if (!prediction) return;

    const newImages = await Promise.all(
      clothingKeys.map(async (key) => {
        const text = prediction[tabKey][key];
        try {
          const result = await getPredictionImages({ text });
          return result.images[0];
        } catch {
          return null;
        }
      })
    );
    setImages(newImages);
  };

  const getTabKey = (tab: string) => tab.toLowerCase();

  const getImageClass = (index: number) => {
    const distance =
      (index - currentSlide + clothingKeys.length) % clothingKeys.length;

    switch (distance) {
      case 0:
        return "z-20 scale-110 rotate-0 opacity-100";
      case 1:
        return "z-10 scale-90 -rotate-12 opacity-40 -translate-x-8";
      case 2:
        return "z-10 scale-90 rotate-12 opacity-40 translate-x-8";
      default:
        return "hidden";
    }
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

      {/* Cylindrical-style image layout */}
      <div className="relative h-[120px] w-full flex items-center justify-center mb-6">
        {images.map(
          (img, idx) =>
            img && (
              <div
                key={idx}
                className={`absolute transition-all duration-500 ease-in-out transform ${getImageClass(
                  idx
                )} border-2 border-white rounded-xl overflow-hidden`}
                style={{ width: 100, height: 100 }}
              >
                <Image
                  src={`http://34.10.109.225:5000/files/${img}`}
                  alt={`Prediction ${idx}`}
                  height={100}
                  width={100}
                />
              </div>
            )
        )}
      </div>

      {/* Text Slider */}
      {prediction && (
        <div
          className="w-full px-4 bg-[#21212180] p-5 rounded-[2rem]"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <h3 className="text-xl font-bold capitalize mb-2">
            {clothingKeys[currentSlide]}
          </h3>
          <p className="text-sm">
            {prediction[getTabKey(activeTab)][clothingKeys[currentSlide]]}
          </p>
        </div>
      )}
    </div>
  );
}
