import { div } from "framer-motion/client";
import { useEffect, useRef, useState } from "react";
import { segmentAnalysis, uploadFile } from "../../../lib/query/queries";
import { SegmentAnalysis } from "../types/UserDetails";
// import Image from "next/image";

type MaskInfo = {
  base64: string;
  points: number[][];
  index: number;
} | null;

export default function OutfitSegmentor({
  image,
  maskData,
}: {
  image: File | null;
  maskData: ArrayBuffer | null;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [contours, setContours] = useState<any[]>([]);
  const [masks, setMasks] = useState<string[]>([]);
  const [maskInfo, setMaskInfo] = useState<MaskInfo>(null);
  const [lockedMask, setLockedMask] = useState<MaskInfo | null>(null);
  const [selectedMasks, setSelectedMasks] = useState<Exclude<MaskInfo, null>[]>(
    []
  );
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [segmentDetails, setSegmentDetails] = useState<SegmentAnalysis[]>([]);
  const [popupIndex, setPopupIndex] = useState<number | null>(null);

  // Animation parameters
  const glowAmountRef = useRef(0);
  const increasingRef = useRef(true);

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          setImgEl(img);
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
          }
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(image);
    }
  }, [image]);

  useEffect(() => {
    if (!maskData) return;
    try {
      const text = new TextDecoder().decode(maskData);
      const data = JSON.parse(text);
      setContours(data.contours || []);
      setMasks(data.masks_base64 || []);
    } catch (err) {
      console.error("❌ Failed to decompress or parse mask data:", err);
    }
  }, [maskData]);

  useEffect(() => {
    const active = lockedMask || maskInfo;
    if (!active || !imgEl || !canvasRef.current) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const updateCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(imgEl, 0, 0);

      if (increasingRef.current) {
        glowAmountRef.current += 0.05;
        if (glowAmountRef.current >= 1) increasingRef.current = false;
      } else {
        glowAmountRef.current -= 0.05;
        if (glowAmountRef.current <= 0.2) increasingRef.current = true;
      }

      contours.forEach((contour, index) => {
        ctx.save();
        ctx.beginPath();
        const pts = contour.points;
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length; i++) {
          ctx.lineTo(pts[i][0], pts[i][1]);
        }
        ctx.closePath();

        if (active && index === active.index) {
          ctx.shadowColor = "rgba(0, 255, 255, 0.8)";
          ctx.shadowBlur = 10 + glowAmountRef.current * 15;
          ctx.lineWidth = 3;
          ctx.strokeStyle = "rgb(0, 255, 255)";
          ctx.stroke();

          ctx.globalAlpha = 0.3 + glowAmountRef.current * 0.2;
          ctx.fillStyle = "rgba(0, 255, 255, 0.5)";
          ctx.fill();
        }

        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(updateCanvas);
    };

    animationRef.current = requestAnimationFrame(updateCanvas);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [maskInfo, lockedMask, imgEl, contours]);

  const pointInPolygon = (point: number[], vs: number[][]) => {
    const [x, y] = point;
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      const [xi, yi] = vs[i],
        [xj, yj] = vs[j];
      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imgEl || lockedMask) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const displayX = e.clientX - rect.left;
    const displayY = e.clientY - rect.top;

    const scaleX = imgEl.width / rect.width;
    const scaleY = imgEl.height / rect.height;
    const x = displayX * scaleX;
    const y = displayY * scaleY;

    let found = false;
    contours.forEach((contour, index) => {
      if (pointInPolygon([x, y], contour.points)) {
        found = true;
        setMaskInfo({
          base64: masks[index],
          points: contour.points,
          index,
        });
      }
    });

    if (!found) {
      setMaskInfo(null);
    }
  };

  const handleClick = () => {
    if (maskInfo && !lockedMask) {
      setLockedMask(maskInfo); // lock the current hover
    }
  };

  const handleTag = async () => {
    if (
      lockedMask &&
      !selectedMasks.some((mask) => mask.index === lockedMask.index)
    ) {
      const tempCanvas = document.createElement("canvas");
      const ctx = tempCanvas.getContext("2d");
      if (!ctx || !imgEl) return;

      const xs = lockedMask.points.map((p) => p[0]);
      const ys = lockedMask.points.map((p) => p[1]);
      const minX = Math.floor(Math.min(...xs));
      const maxX = Math.ceil(Math.max(...xs));
      const minY = Math.floor(Math.min(...ys));
      const maxY = Math.ceil(Math.max(...ys));
      const width = maxX - minX;
      const height = maxY - minY;

      tempCanvas.width = width;
      tempCanvas.height = height;

      ctx.save();
      ctx.beginPath();
      lockedMask.points.forEach(([x, y], i) => {
        const newX = x - minX;
        const newY = y - minY;
        if (i === 0) ctx.moveTo(newX, newY);
        else ctx.lineTo(newX, newY);
      });
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(imgEl, -minX, -minY);

      const dataUrl = tempCanvas.toDataURL("image/png");

      // Convert base64 to File object
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const segmentFile = new File([blob], `segment_${lockedMask.index}.png`, {
        type: "image/png",
      });

      try {
        // Upload the file
        const uploaded = await uploadFile({ image: segmentFile });
        const fileName = uploaded?.filename!;

        // Call analysis API
        const analysisResponse = await segmentAnalysis(fileName);
        // const analysis = analysisResponse.analysis;
        const analysis: SegmentAnalysis | null =
          (analysisResponse as any)?.analysis ?? null;

        if (analysis) {
          setSegmentDetails((prev) => [...prev, analysis]);
        } else {
          console.warn("⚠️ Analysis result missing");
          setSegmentDetails((prev) => [
            ...prev,
            {
              description: "Unknown",
              pattern: "Unknown",
              predominant_color: "Unknown",
              secondary_color: "Unknown",
              style: "Unknown",
              type: "Unknown",
            },
          ]);
        }

        console.log(segmentDetails);

        // Optional: store the analysis results
        // You can push it to a new state array like `segmentDetails` if you want to show it in UI
      } catch (err) {
        console.error("❌ Segment processing failed:", err);
        setSegmentDetails((prev: any) => [...prev, null]);
      }

      // Store locally for preview
      setSelectedMasks((prev) => [...prev, lockedMask]);
      setPreviewUrls((prev) => [...prev, dataUrl]);

      setLockedMask(null);
      setMaskInfo(null);
    }
  };

  const getCenter = (points: number[][]) => {
    const total = points.reduce(
      (acc, [x, y]) => {
        acc.x += x;
        acc.y += y;
        return acc;
      },
      { x: 0, y: 0 }
    );
    return {
      x: total.x / points.length,
      y: total.y / points.length,
    };
  };

  return (
    <div className="flex flex-col gap-6 mt-6 relative">
      <div className="relative w-full">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          className="border border-white rounded-lg w-full max-w-full cursor-pointer"
        />

        {lockedMask && (
          <div
            className="absolute z-10"
            style={{
              left: `${getCenter(lockedMask.points).x}px`,
              top: `${getCenter(lockedMask.points).y}px`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="relative inline-block">
              <button
                className="bg-cyan-500 text-white text-xs px-2 py-1 rounded shadow-md whitespace-nowrap"
                onClick={handleTag}
              >
                + Add to wardrobe
              </button>
              <button
                onClick={() => {
                  setLockedMask(null);
                  setMaskInfo(null);
                }}
                className="absolute -top-2 -right-2 w-5 h-5 text-xs text-red-500 bg-white rounded-full flex items-center justify-center"
                title="Discard"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
      {selectedMasks.length > 0 && segmentDetails.length > 0 && (
        <div className="flex flex-col gap-[1.5rem] self-stretch">
          {previewUrls.map((url, index) => (
            <div key={index} className="flex flex-col gap-[1rem]">
              {(segmentDetails[index]?.type ?? "Segment type")
                .charAt(0)
                .toUpperCase() +
                (segmentDetails[index]?.type ?? "Segment type").slice(1)}
              <div className="flex items-start gap-3">
                {/* Add Button */}
                <div className="w-[7.25rem] h-[6.375rem] flex-col gap-2  rounded-xl overflow-hidden flex items-center justify-center bg-[rgba(33,33,33,0.8)] shadow-[6px_9px_11px_0px_rgba(81,102,241,0.05)]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="w-5 h-5"
                  >
                    <rect
                      width="20"
                      height="20"
                      rx="10"
                      fill="#FEFEFE"
                      fillOpacity="0.1"
                    />
                    <line
                      x1="4"
                      y1="9.80222"
                      x2="16"
                      y2="9.80222"
                      stroke="#9F62ED"
                      strokeWidth="1.8958"
                    />
                    <line
                      x1="10.1979"
                      y1="4"
                      x2="10.1979"
                      y2="16"
                      stroke="#9F62ED"
                      strokeWidth="1.8958"
                    />
                  </svg>
                  <span
                    className="text-[#FEFEFE] text-center text-sm font-medium leading-[1.375rem]"
                    style={{ fontFamily: '"29LT Bukra", sans-serif' }}
                  >
                    Add
                  </span>
                </div>

                {/* Image Container */}
                <div
                  className="w-[7.25rem] h-[6.375rem] flex-shrink-0 border rounded-xl bg-[#D9D9D9] overflow-hidden flex items-center justify-center"
                  onClick={() => setPopupIndex(index)}
                >
                  <img
                    src={url}
                    alt={`Outfit ${index}`}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {popupIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
              onClick={() => setPopupIndex(null)}
            >
              ×
            </button>

            {/* Enlarged Image */}
            <div className="w-full h-64 rounded-lg overflow-hidden flex items-center justify-center mb-4">
              <img
                src={previewUrls[popupIndex]}
                alt="Segment Preview"
                className="object-contain max-h-full"
              />
            </div>

            {/* Segment Details */}
            <div className="text-sm text-gray-800 space-y-2">
              <p>
                <strong>Type:</strong>{" "}
                {(segmentDetails[popupIndex]?.type)}
              </p>
              <p>
                <strong>Style:</strong> {segmentDetails[popupIndex]?.style}
              </p>
              <p>
                <strong>Pattern:</strong> {segmentDetails[popupIndex]?.pattern}
              </p>
              <p>
                <strong>Primary Color:</strong>{" "}
                {segmentDetails[popupIndex]?.predominant_color}
              </p>
              <p>
                <strong>Secondary Color:</strong>{" "}
                {segmentDetails[popupIndex]?.secondary_color}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {segmentDetails[popupIndex]?.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
