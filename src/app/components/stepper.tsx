import { useState } from "react";
import Instructions from "./camera_instructions";
import UserDetsFormContent from "./userdets_form";

export default function Stepper() {
  const [step, setStep] = useState(1);

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <UserDetsFormContent />;
      case 2:
        return <Instructions />;
      default:
        return null;
    }
  };

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 2));
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div
      style={{
        position: "relative",
        minHeight: "90vh",
        // paddingBottom: "7rem",
      }}
    >
      {renderStepContent()}

      <div
        style={{
          position: "absolute",
          bottom: "5rem",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <button onClick={handlePrev} disabled={step === 1}>
          Previous
        </button>
        <button onClick={handleNext} disabled={step === 2}>
          Next
        </button>
      </div>
    </div>
  );
}
