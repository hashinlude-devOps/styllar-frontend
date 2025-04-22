// components/FormContent.tsx
"use client";
import GenderSelect from "../common/select_gender";
import { UserDetailsFormProps } from "@/app/types/UserDetails";

export default function UserDetsFormContent({
  userDetails,
  setUserDetails,
}: UserDetailsFormProps) {
  const handleChange = (field: string, value: string) => {
    setUserDetails((prev: any) => ({ ...prev, [field]: value }));
  };

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
        value={userDetails.name}
        onChange={(e) => handleChange("name", e.target.value)}
        className="flex max-w-[30rem] h-[3.5rem] px-5 py-4 flex-col justify-center items-start gap-1 rounded-[1rem] border border-[#8563ED] bg-[rgba(255,255,255,0.05)] text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#8563ED] focus:border-[#B49CFF] transition"
      />

      <input
        type="email"
        placeholder="Email"
        value={userDetails.email}
        onChange={(e) => handleChange("email", e.target.value)}
        className="flex max-w-[30rem] h-[3.5rem] px-5 py-4 flex-col justify-center items-start gap-1 rounded-[1rem] border border-[#8563ED] bg-[rgba(255,255,255,0.05)] text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#8563ED] focus:border-[#B49CFF] transition"
      />

      <GenderSelect
        selectedGender={userDetails.gender}
        onGenderChange={(gender) =>
          setUserDetails((prev) => ({ ...prev, gender }))
        }
      />

      {/* Weight */}
      <div className="relative max-w-[30rem]">
        <input
          type="number"
          placeholder="*Weight (kg)"
          value={userDetails.weight}
          onChange={(e) => handleChange("weight", e.target.value)}
          className="w-full h-[3.5rem] px-5 py-4 rounded-[1rem] border border-[#8563ED] bg-[rgba(255,255,255,0.05)] text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#8563ED] focus:border-[#B49CFF] transition"
        />
      </div>

      {/* Height */}
      <div className="relative max-w-[30rem]">
        <input
          type="number"
          placeholder="*Height (cm)"
          value={userDetails.height}
          onChange={(e) => handleChange("height", e.target.value)}
          className="w-full h-[3.5rem] px-5 py-4 rounded-[1rem] border border-[#8563ED] bg-[rgba(255,255,255,0.05)] text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#8563ED] focus:border-[#B49CFF] transition"
        />
      </div>
    </div>
  );
}
