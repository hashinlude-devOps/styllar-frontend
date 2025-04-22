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
  const animationRef = useRef<number | null>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [contours, setContours] = useState<any[]>([]);
  const [masks, setMasks] = useState<string[]>([]);
  const [maskInfo, setMaskInfo] = useState<MaskInfo>(null);
  // Animation parameters
  const glowAmountRef = useRef(0);
  const increasingRef = useRef(true);

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

  // Animation effect
  useEffect(() => {
    // Only start animation if we have an active selection
    if (!maskInfo || !imgEl || !canvasRef.current) {
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
      
      // Clear and redraw base image
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(imgEl, 0, 0);
      
      // Update glow amount for animation
      if (increasingRef.current) {
        glowAmountRef.current += 0.05;
        if (glowAmountRef.current >= 1) {
          increasingRef.current = false;
        }
      } else {
        glowAmountRef.current -= 0.05;
        if (glowAmountRef.current <= 0.2) {
          increasingRef.current = true;
        }
      }
      
      // Draw all contours
      contours.forEach((contour, index) => {
        ctx.save();
        ctx.beginPath();
        const pts = contour.points;
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length; i++) {
          ctx.lineTo(pts[i][0], pts[i][1]);
        }
        ctx.closePath();
        
        if (maskInfo && index === maskInfo.index) {
          // Active selection with glowing effect
          // Set shadow properties for glow
          ctx.shadowColor = "rgba(0, 255, 255, 0.8)";
          ctx.shadowBlur = 10 + (glowAmountRef.current * 15);
          ctx.lineWidth = 3;
          ctx.strokeStyle = "rgb(0, 255, 255)";
          ctx.stroke();
          
          // Fill with semi-transparent color
          ctx.globalAlpha = 0.3 + (glowAmountRef.current * 0.2);
          ctx.fillStyle = "rgba(0, 255, 255, 0.5)";
          ctx.fill();
        } else {
          // Non-selected contours
          ctx.lineWidth = 1;
          // ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
          ctx.stroke();
        }
        
        ctx.restore();
      });
      
      // Continue animation loop
      animationRef.current = requestAnimationFrame(updateCanvas);
    };
    
    // Start animation loop
    animationRef.current = requestAnimationFrame(updateCanvas);
    
    // Clean up animation on unmount or when selection changes
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [maskInfo, imgEl, contours]);

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
    if (!imgEl) return;
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

  const handleClick = (e: React.MouseEvent) => {
    // Optional: Add click functionality to lock selection
    // This would let users click to keep a segment selected
    console.log("selected")
  };

  return (
    <div className="flex flex-col gap-6 mt-6">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        className="border border-white rounded-lg w-full max-w-full cursor-pointer"
      />

      {/* {maskInfo && (
        <div className="text-white text-sm bg-[#1a1a1a] p-4 rounded-lg space-y-2">
          <p>
            <strong>Segment {maskInfo.index + 1} selected</strong>
          </p>
        </div>
      )} */}
    </div>
  );
}