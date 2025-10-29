"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ColorBendsBackgroundProps {
  className?: string;
  height?: number | "full";
}

export function ColorBendsBackground({ className, height = 400 }: ColorBendsBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const timeRef = useRef(0);
  const heightRef = useRef(height);

  // Update height ref when prop changes without restarting the effect
  useEffect(() => {
    heightRef.current = height;
  }, [height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const newWidth = window.innerWidth;
      const newHeight = heightRef.current === "full" ? window.innerHeight : heightRef.current;
      
      // Only resize if dimensions actually changed to prevent unnecessary updates
      if (canvas.width !== newWidth || canvas.height !== newHeight) {
        canvas.width = newWidth;
        canvas.height = newHeight;
      }
    };

    const draw = () => {
      timeRef.current += 0.005;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create multiple flowing gradient layers
      const colors = [
        { r: 59, g: 130, b: 246 }, // blue-500
        { r: 139, g: 92, b: 246 }, // violet-500
        { r: 236, g: 72, b: 153 }, // pink-500
        { r: 14, g: 165, b: 233 }, // sky-500
      ];

      colors.forEach((color, index) => {
        const offset = (index * Math.PI * 2) / colors.length;
        const wave = Math.sin(timeRef.current + offset) * 0.5 + 0.5;
        
        const x = canvas.width * (0.25 + index * 0.25);
        const y = canvas.height * (0.3 + wave * 0.4);
        
        const radius = 200 + Math.sin(timeRef.current * 0.5 + offset) * 50;
        
        // Create radial gradient
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.4)`);
        gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, 0.2)`);
        gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    resizeCanvas();
    draw();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className={cn("relative w-full overflow-hidden dark:block hidden", className)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ filter: "blur(80px)" }}
      />
      {/* Additional overlay gradients for more depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-purple-950/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-950/10 to-transparent" />
    </div>
  );
}

