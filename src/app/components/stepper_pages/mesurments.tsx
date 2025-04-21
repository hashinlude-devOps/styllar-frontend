import Image from "next/image";
import Avatar from "../../../../public/images/avatar.png";

export default function Mesurments() {
  const mesurments = [
    { key: "Height", value: 168, unit: "CM" },
    { key: "Chest", value: 86, unit: "CM" },
    { key: "Waist", value: 66, unit: "CM" },
    { key: "Hip", value: 91, unit: "CM" },
  ];
  return (
    <>
      <div className="flex flex-col gap-[0.75rem]">
        <div className="text-[1.5rem] font-semibold">
          We’ve measured your body
        </div>
        <div className="text-1rem]">
          Take a look to make sure everything looks right. you can adjust the
          measurements if needed.
        </div>
      </div>
      <div className="flex mt-[2.3rem] justify-between">
        <div className="">
          <Image alt="Avatar" height={100} width={150} src={Avatar} />
        </div>
        <div className="">
          <div className="flex flex-col gap-[0.5rem]">
            {mesurments.map((measurement, index) => (
              <div
                key={index}
                className="p-[0.5rem] bg-[#212121CC] rounded-[0.95rem]"
              >
                <div className="text-white text-[0.634rem] font-bold">
                  {measurement.key}
                </div>

                <div className="flex justify-between items-center gap-2">
                  <div className="flex items-baseline gap-1">
                    <div className="text-[1.5rem] text-[#3AAEF8]">
                      {measurement.value}
                    </div>
                    <div className="text-[0.5rem] text-[#8A8B8F]">
                      {measurement.unit}
                    </div>
                  </div>
                  <div className="flex gap-[0.5rem]">
                    <div className="bg-[linear-gradient(0deg,rgba(0,0,0,0.14)_0%,rgba(0,0,0,0.14)_100%),linear-gradient(124deg,#9F62ED_-4.44%,#3AAEF8_139.98%)] rounded-[14rem]  w-[2.135rem] flex items-center justify-center h-[1.5rem]">
                      -
                    </div>
                    <div className="bg-[linear-gradient(0deg,rgba(0,0,0,0.14)_0%,rgba(0,0,0,0.14)_100%),linear-gradient(124deg,#9F62ED_-4.44%,#3AAEF8_139.98%)] rounded-[14rem]  w-[2.135rem] flex items-center justify-center h-[1.5rem]">
                      +
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
