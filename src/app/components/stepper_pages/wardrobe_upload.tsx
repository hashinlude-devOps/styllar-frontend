// components/FormContent.tsx
"use client";

import OutfitSegmentor from "../outfitSegmentor";

export default function WardrobeUpload({
  image,
  maskData,
}: {
  image: File | null;
  maskData: ArrayBuffer | null;
}) {
  return (
    <>
      <div className="flex flex-col gap-[1.5rem]">
        <h1 className="text-[#FEFEFE] text-[24px] font-semibold not-italic leading-[120%] tracking-[-0.03rem]">
          Bring Your Wardrobe to Life!
        </h1>

        <p className="text-[#FEFEFE] text-[16px] font-normal leading-[140%] not-italic">
          Integrating your wardrobe into a virtual wardrobe.
        </p>
        <OutfitSegmentor image={image} maskData={maskData} />
      </div>
    </>
  );
}
