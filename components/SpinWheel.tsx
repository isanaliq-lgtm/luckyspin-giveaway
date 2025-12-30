import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Prize } from '../types';

interface SpinWheelProps {
  prizes: Prize[];
  onResult: (prize: Prize) => void;
  isSpinning: boolean;
  setIsSpinning: (val: boolean) => void;
}

const SpinWheel: React.FC<SpinWheelProps> = ({ prizes, onResult, isSpinning, setIsSpinning }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const requestRef = useRef<number>();

  const FRICTION = 0.992;
  const MIN_VELOCITY = 0.002;

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = Math.min(canvas.width, canvas.height);
    const radius = size / 2 - 20;
    const centerX = size / 2;
    const centerY = size / 2;
    const sliceAngle = (2 * Math.PI) / prizes.length;

    ctx.clearRect(0, 0, size, size);

    prizes.forEach((prize, i) => {
      const startAngle = i * sliceAngle + rotation;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.fillStyle = prize.color;
      ctx.fill();
      ctx.strokeStyle = '#ffffff33';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px Inter';
      ctx.shadowBlur = 4;
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.fillText(prize.text, radius - 40, 6);
      ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX - 20, 20);
    ctx.lineTo(centerX + 20, 20);
    ctx.lineTo(centerX, 60);
    ctx.closePath();
    ctx.fillStyle = '#ef4444';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

  }, [prizes, rotation]);

  const animate = useCallback(() => {
    if (velocity > 0) {
      setRotation(prev => prev + velocity);
      setVelocity(prev => prev * FRICTION);

      if (velocity < MIN_VELOCITY) {
        setVelocity(0);
        setIsSpinning(false);
        
        const sliceAngle = (2 * Math.PI) / prizes.length;
        const adjustedRotation = (rotation % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        const pointerPos = (1.5 * Math.PI - adjustedRotation + 2 * Math.PI) % (2 * Math.PI);
        const index = Math.floor(pointerPos / sliceAngle);
        onResult(prizes[index]);
      }
    }
    requestRef.current = requestAnimationFrame(animate);
  }, [velocity, prizes, rotation, setIsSpinning, onResult]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate]);

  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    const newVelocity = 0.25 + Math.random() * 0.15;
    setVelocity(newVelocity);
  };

  return (
    <div className="relative group cursor-pointer" onClick={spin}>
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="max-w-full drop-shadow-2xl transition-transform hover:scale-[1.01]"
      />
      {!isSpinning && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full text-white font-bold border border-white/20 animate-bounce">
            Click to Spin!
          </div>
        </div>
      )}
    </div>
  );
};

export default SpinWheel;
