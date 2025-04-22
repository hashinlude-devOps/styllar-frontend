import { CameraCaptureProps } from "@/app/types/UserDetails";
import { useEffect, useRef, useState } from "react";
import { FaCamera, FaTimes } from "react-icons/fa";

export default function CameraCapture({
  onProceedToMeasurements,
  onGoBack,
  setCapturedImages,
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [capturedFront, setCapturedFront] = useState(false);
  const [capturedSide, setCapturedSide] = useState(false);
  const [currentCapture, setCurrentCapture] = useState<"front" | "side">(
    "front"
  );
  const [isProcessing, setIsProcessing] = useState(false); // disables capture button during state switch

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const captureImage = () => {
    if (!videoRef.current || isProcessing) return;

    console.log("📸 Capturing:", currentCapture);
    setIsProcessing(true);

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;

      const file = new File([blob], `${currentCapture}_image.png`, {
        type: "image/png",
      });

      if (currentCapture === "front") {
        setCapturedFront(true);
        setCapturedImages((prev) => ({ ...prev, front: file }));
        setTimeout(() => {
          setCurrentCapture("side");
          setIsProcessing(false);
        }, 200);
      } else {
        setCapturedSide(true);
        setCapturedImages((prev) => {
          const updated = { ...prev, side: file };
          console.log("📤 Final Payload before upload:", updated);
          return updated;
        });

        setTimeout(() => {
          if (videoRef.current?.srcObject) {
            const tracks = (
              videoRef.current.srcObject as MediaStream
            ).getTracks();
            tracks.forEach((track) => track.stop());
          }
          onProceedToMeasurements();
        }, 1000);
      }
    }, "image/png");
  };

  useEffect(() => {
    if (capturedFront && capturedSide) {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    }
  }, [capturedFront, capturedSide]);

  const handleGoBack = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    onGoBack();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex justify-center items-center overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />

      {/* Close Button */}
      <button
        onClick={handleGoBack}
        className="absolute top-4 right-4 z-20 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
      >
        <FaTimes className="text-lg" />
      </button>

      {/* Capture status indicator */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-10">
        <button
          className={`p-3 rounded-full backdrop-blur-sm text-white ${
            capturedFront ? "bg-green-500" : "bg-white/20"
          }`}
        >
          <img src="/frontpose.svg" alt="Front" width={42} height={42} />
        </button>
        <button
          className={`p-3 rounded-full backdrop-blur-sm text-white ${
            capturedSide ? "bg-green-500" : "bg-white/20"
          }`}
        >
          <img src="/sidepose.svg" alt="Side" width={42} height={42} />
        </button>
      </div>

      {/* Capture button */}
      <div className="absolute bottom-6 flex justify-center w-full z-10">
        <button
          onClick={captureImage}
          disabled={capturedFront && capturedSide}
          className="rounded-[1rem] py-[1rem] px-[1.5rem] bg-[#2121216b] backdrop-blur-[7.5px] w-full max-w-[200px] flex items-center justify-center gap-2 text-white disabled:opacity-50 transition-opacity"
        >
          <FaCamera className="text-white/70 text-lg" />
          Capture {currentCapture === "front" ? "Front" : "Side"}
        </button>
      </div>
    </div>
  );
}
