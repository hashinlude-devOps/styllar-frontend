"use client";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Instructions from "./stepper_pages/camera_instructions";
import UserDetsFormContent from "./stepper_pages/userdets_form";
import { BackwardArrow, ForwardArrow } from "./svg";
import Mesurments from "./stepper_pages/mesurments";
import CameraCapture from "./stepper_pages/camera_capture";
import { uploadMeasurements } from "../../../lib/query/queries";

export default function Stepper() {
  const [step, setStep] = useState(1);
  const [isNextEnabled, setIsNextEnabled] = useState(true);
  const [mesurments, setMesurments] = useState<any>();

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 4));
  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));

  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    dob: "",
    height: "",
    weight: "",
    gender: "",
  });

  const [capturedImages, setCapturedImages] = useState<{
    front: File | null;
    side: File | null;
  }>({ front: null, side: null });

  useEffect(() => {
    if (step === 1) setIsNextEnabled(true);
    else if (step === 2 || step === 3) setIsNextEnabled(false);
  }, [step]);

  useEffect(() => {
    if (step === 4 && capturedImages.front && capturedImages.side) {
      callUploadMeasurements();
    }
  }, [step, capturedImages]);

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
        return <Mesurments key="step1" measurements={mesurments} />;

      default:
        return null;
    }
  };

  const callUploadMeasurements = async () => {
    try {
      const payload = {
        frontImage: capturedImages.front!,
        sideImage: capturedImages.side!,
        height: parseFloat(userDetails.height),
        weight: parseFloat(userDetails.weight),
        gender: userDetails.gender as "male" | "female",
      };

      const response = await uploadMeasurements(payload);
      setMesurments((response as any)?.measurements);
    } catch (error) {
      console.log(error);
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

      <div className="sticky bottom-10 left-0 right-0 flex justify-center gap-4 z-10 mt-10">
        <button
          onClick={handlePrev}
          disabled={step === 1}
          className="rounded-[1rem] py-[1rem] px-[1.5rem] bg-[#2121216b] backdrop-blur-[7.5px] w-full flex items-center justify-center disabled:opacity-50 transition-opacity"
        >
          <BackwardArrow />
        </button>

        <button
          onClick={handleNext}
          disabled={!isNextEnabled || step === 4}
          className="rounded-[1rem] py-[1rem] px-[1.5rem] bg-[#2121216b] backdrop-blur-[7.5px] w-full flex items-center justify-center disabled:opacity-50 transition-opacity"
        >
          <ForwardArrow />
        </button>
      </div>
    </div>
  );
}
