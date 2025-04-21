import { useState } from "react";
import Instructions from "./camera_instructions";

export default function Stepper() {
  const [step, setStep] = useState(1);

  switch (step) {
    case 1:
      return <Instructions />;

    default:
      break;
  }
}
