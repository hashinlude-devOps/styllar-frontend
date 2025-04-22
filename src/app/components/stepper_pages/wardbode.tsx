// components/FormContent.tsx
"use client";

export default function Wardrobe() {
  return (
    <div className="flex flex-col gap-[1.5rem]">
      <h1 className="text-white text-[24px] font-semibold leading-[120%] tracking-[-0.03rem]">
        Hey there! <br /> We’re excited to style you.
      </h1>
      <p className="text-white text-[16px] font-normal leading-[140%]">
        What’s your name so we can make this personal?
      </p>
    </div>
  );
}
