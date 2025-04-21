import { useState } from "react";
import Instructions from "./camera_instructions";
import UserDetsFormContent from "./userdets_form";

export default function Stepper() {
  const [step, setStep] = useState(1);

  switch (step) {
    case 1:
      return <UserDetsFormContent />;
    case 2:
      return <Instructions />;

    default:
      break;
  }
}
