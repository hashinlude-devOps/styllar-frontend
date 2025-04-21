import { useState } from "react";

export default function GenderSelect() {
  const [selectedGender, setSelectedGender] = useState("");

  const genders = ["Female", "Male"];

  return (
    <div className="flex flex-col items-start gap-4 max-w-[30rem] w-full">
      <div className="flex w-full gap-4">
        {genders.map((gender) => (
          <label
            key={gender}
            className={`w-1/2 cursor-pointer flex px-3 py-3 justify-center items-center gap-[0.625rem] rounded-xl shadow-[6px_9px_11px_0px_rgba(81,102,241,0.05)] transition
            ${
              selectedGender === gender
                ? "bg-[#9F62ED] text-white"
                : "bg-[rgba(33,33,33,0.80)] text-white"
            }
          `}
          >
            <input
              type="radio"
              name="gender"
              value={gender}
              checked={selectedGender === gender}
              onChange={() => setSelectedGender(gender)}
              className="hidden"
            />
            {gender}
          </label>
        ))}
      </div>
    </div>
  );
}
