import { useEffect, useState } from "react";

let triggerFn: (() => void) | null = null;

export function triggerZapStrike() {
  triggerFn?.();
}

export function ZapStrikeOverlay() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    triggerFn = () => setActive(true);
    return () => { triggerFn = null; };
  }, []);

  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setActive(false), 1200);
    return () => clearTimeout(t);
  }, [active]);

  if (!active) return null;

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: overlay dismiss
    // biome-ignore lint/a11y/useKeyWithClickEvents: overlay dismiss
    <div className="zap-strike-overlay" onClick={() => setActive(false)}>
      {/* Main bolt */}
      <svg
        className="zap-strike-bolt"
        viewBox="0 0 120 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Lightning bolt zap animation"
      >
        <path
          d="M70 0 L45 120 L75 120 L30 300 L90 155 L55 155 L95 0 Z"
          fill="url(#boltGrad)"
          filter="url(#glow)"
        />
        <defs>
          <linearGradient id="boltGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="30%" stopColor="#c084fc" />
            <stop offset="70%" stopColor="#8300ff" />
            <stop offset="100%" stopColor="#5b21b6" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Side sparks */}
      <div className="zap-strike-sparks">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="zap-strike-spark"
            style={{
              ["--angle" as string]: `${i * 45}deg`,
              ["--delay" as string]: `${i * 0.04}s`,
              ["--dist" as string]: `${60 + Math.random() * 80}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
