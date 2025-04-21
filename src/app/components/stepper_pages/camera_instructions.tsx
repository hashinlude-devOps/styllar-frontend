import Image from "next/image";

export default function Instructions() {
  return (
    <div className="flex flex-col gap-[0.75rem]">
      <div className="text-[1.5rem] font-semibold">
        Let’s get the perfect  fit for you!
      </div>
      <div className="text-1rem]">
        Let’s get the perfect fit! Use your mobile camera to scan your full body
        from 2 angles. Don’t worry—you can adjust the details afterward if
        needed!
      </div>
      <Image
        src="/bodycountour.svg"
        alt="Side Pose"
        width={0}
        height={0}
        sizes="100vw"
        className="w-full h-auto rounded-lg object-contain"
      />
      <button className="flex w-full px-6 py-4 justify-center items-center gap-2 rounded-[1rem] bg-[rgba(33,33,33,0.42)] backdrop-blur-[20px]">
        <span className="flex flex-col justify-center items-start rounded-[0.5rem] text-white text-center text-base font-normal leading-6 tracking-normal [font-feature-settings:'ss01'_on,'cv01'_on]">
          Open Camera
        </span>
      </button>
    </div>
  );
}
