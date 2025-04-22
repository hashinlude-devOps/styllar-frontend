import pako from "pako";
import { useEffect, useRef, useState } from "react";

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
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [contours, setContours] = useState<any[]>([]);
  const [masks, setMasks] = useState<string[]>([]);
  const [maskInfo, setMaskInfo] = useState<MaskInfo>(null);

  console.log("am here bitch");

  useEffect(() => {
    console.log("image", image);
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
      const text = new TextDecoder().decode(maskData); // from ArrayBuffer
      const data = JSON.parse(text);

      console.log("Decompressed data:", data);
      setContours(data.contours || []);
      setMasks(data.masks_base64 || []);
    } catch (err) {
      console.error("❌ Failed to decompress or parse mask data:", err);
    }
  }, [maskData]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imgEl) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const displayX = e.clientX - rect.left;
    const displayY = e.clientY - rect.top;

    const scaleX = imgEl.width / rect.width;
    const scaleY = imgEl.height / rect.height;
    const x = displayX * scaleX;
    const y = displayY * scaleY;

    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    ctx?.drawImage(imgEl, 0, 0);

    let found = false;
    contours.forEach((contour, index) => {
      if (pointInPolygon([x, y], contour.points)) {
        found = true;
        setMaskInfo({
          base64: masks[index],
          points: contour.points,
          index,
        });

        ctx!.save();
        ctx!.beginPath();
        const pts = contour.points;
        ctx!.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length; i++) {
          ctx!.lineTo(pts[i][0], pts[i][1]);
        }
        ctx!.closePath();
        ctx!.lineWidth = 3;
        ctx!.strokeStyle = "red";
        ctx!.stroke();
        ctx!.globalAlpha = 0.4;
        ctx!.fillStyle = "cyan";
        ctx!.fill();
        ctx!.restore();
      }
    });

    if (!found) {
      setMaskInfo(null);
    }
  };

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

  return (
    <div className="flex flex-col gap-6 mt-6">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        className="border border-white rounded-lg w-full max-w-full"
      />

      {/* {maskInfo && (
        <div className="text-white text-sm bg-[#1a1a1a] p-4 rounded-lg space-y-2">
          <p>
            <strong>Mask Index:</strong> {maskInfo.index}
          </p>
          <p>
            <strong>Base64 (preview):</strong>{" "}
            <code className="break-all">
              {maskInfo.base64?.slice(0, 40)}...
            </code>
          </p>
          <p>
            <strong>Points:</strong>{" "}
            {JSON.stringify(maskInfo.points?.slice(0, 2))}...
          </p>
        </div>
      )} */}
    </div>
  );
}
