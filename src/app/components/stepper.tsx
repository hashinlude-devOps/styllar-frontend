"use client";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Instructions from "./stepper_pages/camera_instructions";
import UserDetsFormContent from "./stepper_pages/userdets_form";
import { BackwardArrow, ForwardArrow } from "./svg";
import Mesurments from "./stepper_pages/mesurments";
import CameraCapture from "./stepper_pages/camera_capture";
import {
  fetchMaskData,
  getPredictionImages,
  getPredictions,
  removeBg,
  segmentOutfit,
  uploadAttributes,
  uploadFile,
  uploadMeasurements,
} from "../../../lib/query/queries";
import WardrobeUpload from "./stepper_pages/wardrobe_upload";
import Predictions from "./stepper_pages/predictions";

export default function Stepper() {
  const [step, setStep] = useState(1);
  const [isNextEnabled, setIsNextEnabled] = useState(true);
  const [bgRemoved, setBgRemoved] = useState<any>(null);
  const [maskData, setMaskData] = useState<ArrayBuffer | null>(null);
  const [predictions, setPredictions] = useState<any>(null);
  const [tabImages, setTabImages] = useState<Record<string, (string | null)[]>>(
    {
      casual: [null, null, null],
      office: [null, null, null],
      party: [null, null, null],
    }
  );
  const [currentSlide, setCurrentSlide] = useState(0);

  const [measurements, setMeasurements] = useState<any>([
    { key: "ankle", value: null, unit: "CM" },
    { key: "arm_length", value: null, unit: "CM" },
    { key: "bicep", value: null, unit: "CM" },
    { key: "calf", value: null, unit: "CM" },
    { key: "chest", value: null, unit: "CM" },
    { key: "forearm", value: null, unit: "CM" },
    { key: "hip", value: null, unit: "CM" },
    { key: "leg_length", value: null, unit: "CM" },
    { key: "neck", value: null, unit: "CM" },
    { key: "shoulder_breadth", value: null, unit: "CM" },
    { key: "shoulder_to_crotch", value: null, unit: "CM" },
    { key: "thigh", value: null, unit: "CM" },
    { key: "waist", value: null, unit: "CM" },
    { key: "wrist", value: null, unit: "CM" },
  ]);

  const [attributes, setAttributes] = useState<any>([
    { key: "age", value: null },
    { key: "gender", value: null },
    { key: "hair_color", value: null },
    { key: "hair_type", value: null },
    { key: "has_facial_hair", value: null },
    { key: "lighting", value: null },
    { key: "skin_tone", value: null },
  ]);

  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrev = () => setStep((prev) => prev - 1);

  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    height: "",
    weight: "",
    gender: "",
  });

  const [capturedImages, setCapturedImages] = useState<{
    front: File | null;
    side: File | null;
  }>({ front: null, side: null });

  const tabs = ["Casual", "Office", "Party"];
  const clothingKeys = ["bottom", "outerwear", "top"];

  const fetchAllPredictionsAndImages = async () => {
    const measurementObject = measurements?.reduce((acc: any, item: any) => {
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
              text: `For ${userDetails.gender} ${text}`,
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

  useEffect(() => {
    if (step === 1) {
      const isValid =
        userDetails.height.trim() !== "" &&
        userDetails.weight.trim() !== "" &&
        userDetails.gender.trim() !== "";
      setIsNextEnabled(isValid);
    }
  }, [step, userDetails]);

  useEffect(() => {
    if (step === 4 && capturedImages.front && capturedImages.side) {
      callUploadMeasurements();
    }
  }, [step, capturedImages]);

  useEffect(() => {
    if (step === 4 && measurements && maskData) {
      setIsNextEnabled(true);
    } else if (step === 4) {
      setIsNextEnabled(false);
    }
  }, [step, measurements, maskData]);

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <UserDetsFormContent
            key="step1"
            userDetails={userDetails}
            setUserDetails={setUserDetails}
          />
        );
      case 2:
        return (
          <Instructions
            key="step2"
            onEnableNext={() => setIsNextEnabled(true)}
            onProceedToCamera={handleNext}
          />
        );
      case 3:
        return (
          <CameraCapture
            key="step3"
            onProceedToMeasurements={handleNext}
            onGoBack={handlePrev}
            setCapturedImages={setCapturedImages}
          />
        );
      case 4:
        return (
          <Mesurments
            key="step4"
            measurements={measurements}
            setMeasurements={setMeasurements}
            attributes={attributes}
            image={bgRemoved}
          />
        );

      case 5:
        return (
          <WardrobeUpload
            key="step5"
            image={capturedImages.front}
            maskData={maskData}
          />
        );

      case 6:
        return (
          <Predictions
            key="step7"
            predictions={predictions}
            tabImages={tabImages}
            currentSlide={currentSlide}
            setCurrentSlide={setCurrentSlide}
          />
        );
      default:
        return null;
    }
  };

  const callUploadMeasurements = async () => {
    try {
      const front_image = await uploadFile({
        image: capturedImages.front!,
      });

      const sideImage = await uploadFile({
        image: capturedImages.side!,
      });

      const bgRemovedImaage = await removeBg({
        image: capturedImages.front!,
      });

      setBgRemoved(bgRemovedImaage?.image);

      const payload = {
        frontImage: front_image?.filename!,
        sideImage: sideImage?.filename!,
        height: parseFloat(userDetails.height),
        weight: parseFloat(userDetails.weight),
        gender: userDetails.gender as "male" | "female",
      };

      const [measurementsResponse, attributesResponse, segmentationResponse] =
        await Promise.all([
          uploadMeasurements(payload),
          uploadAttributes(front_image?.filename!),
          segmentOutfit(front_image?.filename!),
        ]);

      setMeasurements((prev: any[]) =>
        prev.map((item) => ({
          ...item,
          value: (measurementsResponse as any)?.measurements[item.key] ?? null,
        }))
      );

      setAttributes((prev: any[]) =>
        prev.map((item) => ({
          ...item,
          value:
            (attributesResponse as any)?.predictions[0]?.mapped_predictions?.[
              item.key
            ] ?? null,
        }))
      );

      const maskFilename = (segmentationResponse as any)?.["filename"] ?? null;

      if (maskFilename) {
        const maskData = await fetchMaskData(maskFilename);
        setMaskData(maskData as ArrayBuffer);
      }

      fetchAllPredictionsAndImages();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative min-h-[85vh]">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStepContent()}
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-[2rem] w-full flex justify-center gap-4 z-10 mt-10">
        <button
          onClick={handlePrev}
          disabled={step === 1}
          className="rounded-[1rem] py-[1rem] px-[1.5rem] bg-[#2121216b] backdrop-blur-[7.5px] w-full flex items-center justify-center disabled:opacity-50 transition-opacity"
        >
          <BackwardArrow />
        </button>

        {step !== 6 && (
          <button
            onClick={handleNext}
            disabled={!isNextEnabled}
            className="rounded-[1rem] py-[1rem] px-[1.5rem] bg-[#2121216b] backdrop-blur-[7.5px] w-full flex items-center justify-center disabled:opacity-50 transition-opacity"
          >
            <ForwardArrow />
          </button>
        )}
      </div>
    </div>
  );
}
