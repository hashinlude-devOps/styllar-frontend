// components/FormContent.tsx
"use client";
import { useState } from "react";
import GenderSelect from "./select_gende";

export default function UserDetsFormContent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  return (
    <div className="flex flex-col gap-[1.5rem]">
      <h1 className="text-white text-[24px] font-semibold leading-[120%] tracking-[-0.03rem]">
        Hey there! <br /> We’re excited to style you.
      </h1>
      <p className="text-white text-[16px] font-normal leading-[140%]">
        What’s your name so we can make this personal?
      </p>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex max-w-[30rem] h-[3.5rem] px-5 py-4 flex-col justify-center items-start gap-1 rounded-[1rem] border border-[#8563ED] bg-[rgba(255,255,255,0.05)] text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#8563ED] focus:border-[#B49CFF] transition"
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex max-w-[30rem] h-[3.5rem] px-5 py-4 flex-col justify-center items-start gap-1 rounded-[1rem] border border-[#8563ED] bg-[rgba(255,255,255,0.05)] text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#8563ED] focus:border-[#B49CFF] transition"
      />

      <GenderSelect />

      <input
        type="date"
        placeholder="Date of Birth"
        value={dob}
        onChange={(e) => setDob(e.target.value)}
        className="custom-date-input max-w-[30rem] h-[3.5rem] px-5 py-4 rounded-[1rem] border border-[#8563ED] bg-[rgba(255,255,255,0.05)] text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#8563ED] focus:border-[#B49CFF] transition"
      />

      {/* Weight */}
      <div className="relative max-w-[30rem]">
        <input
          type="number"
          placeholder="Weight (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-full h-[3.5rem] px-5 py-4 rounded-[1rem] border border-[#8563ED] bg-[rgba(255,255,255,0.05)] text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#8563ED] focus:border-[#B49CFF] transition"
        />
      </div>

      {/* Height */}
      <div className="relative max-w-[30rem]">
        <input
          type="number"
          placeholder="Height (cm)"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          className="w-full h-[3.5rem] px-5 py-4 rounded-[1rem] border border-[#8563ED] bg-[rgba(255,255,255,0.05)] text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#8563ED] focus:border-[#B49CFF] transition"
        />
      </div>
    </div>
  );
}
