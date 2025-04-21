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
      <div>
      <Image
        src="/bodycountour.svg"
        alt="Side Pose"
        fill
        className="rounded-lg  object-contain"
      />
      </div>
    </div>
  );
}
