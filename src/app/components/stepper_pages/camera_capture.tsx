import { CameraCaptureProps } from "@/app/types/UserDetails";
import { useEffect, useRef, useState } from "react";
import { FaCamera, FaTimes, FaSync } from "react-icons/fa";

export default function CameraCapture({
  onProceedToMeasurements,
  onGoBack,
  setCapturedImages,
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [capturedFront, setCapturedFront] = useState(false);
  const [capturedSide, setCapturedSide] = useState(false);
  const [currentCapture, setCurrentCapture] = useState<"front" | "side">(
    "front"
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const stopCurrentStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError("Your browser does not support camera access.");
      return;
    }

    // Stop any existing stream first
    stopCurrentStream();

    try {
      // First try with exact constraint to force the specific camera
      const constraints = {
        video: {
          facingMode: { exact: facingMode },
        },
      };

      try {
        streamRef.current = await navigator.mediaDevices.getUserMedia(
          constraints
        );
      } catch (exactError) {
        console.log(
          "Failed with exact constraint, trying with preference:",
          exactError
        );

        // If that fails, try with preference only
        streamRef.current = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facingMode },
        });
      }

      if (videoRef.current) {
        videoRef.current.srcObject = streamRef.current;
        setCameraError(null);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setCameraError(
        "Failed to access camera. Please check permissions or try a different browser."
      );
    }
  };

  useEffect(() => {
    startCamera();

    return () => {
      stopCurrentStream();
    };
  }, [facingMode]);

  const toggleCamera = () => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };

  const captureImage = () => {
    if (!videoRef.current || isProcessing || !streamRef.current) return;

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
          return updated;
        });

        setTimeout(() => {
          stopCurrentStream();
          onProceedToMeasurements();
        }, 1000);
      }
    }, "image/png");
  };

  useEffect(() => {
    if (capturedFront && capturedSide) {
      stopCurrentStream();
    }
  }, [capturedFront, capturedSide]);

  const handleGoBack = () => {
    stopCurrentStream();
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

      {/* Camera Error Message */}
      {cameraError && (
        <div className="absolute top-1/2 left-0 right-0 bg-red-500/80 text-white py-2 px-4 text-center">
          {cameraError}
        </div>
      )}

      {/* Close Button */}
      <button
        onClick={handleGoBack}
        className="absolute top-4 right-4 z-20 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
      >
        <FaTimes className="text-lg" />
      </button>

      {/* Camera Switch Button */}
      <button
        onClick={toggleCamera}
        className="absolute top-4 left-4 z-20 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
        disabled={isProcessing}
      >
        <FaSync className={`text-lg ${isProcessing ? "opacity-50" : ""}`} />
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
          // disabled={capturedFront && capturedSide || isProcessing || !streamRef.current}
          className="rounded-[1rem] py-[1rem] px-[1.5rem] bg-[#2121216b] backdrop-blur-[7.5px] w-full max-w-[200px] flex items-center justify-center gap-2 text-white disabled:opacity-50 transition-opacity"
        >
          <FaCamera className="text-white/70 text-lg" />
          Capture {currentCapture === "front" ? "Front" : "Side"}
        </button>
      </div>
    </div>
  );
}
