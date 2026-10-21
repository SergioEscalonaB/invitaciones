"use client";

import React, { useEffect, useState } from "react";

interface Sparkle {
  id: number;
  top: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
}

export function FairyDust() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    // Generar partículas aleatorias de ensueño
    const colors = [
      "rgba(250, 246, 237, 0.7)", // marfil
      "rgba(212, 175, 55, 0.8)", // oro suave
      "rgba(247, 226, 230, 0.65)", // rosa suave
      "rgba(245, 232, 216, 0.75)", // champagne
    ];

    const items: Sparkle[] = [];
    const count = 35;

    for (let i = 0; i < count; i++) {
      items.push({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 3 + 1.5,
        delay: Math.random() * 5,
        duration: Math.random() * 4 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    setSparkles(items);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* Luces cálidas de ambiente (bokeh suave) */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#631C3B]/25 blur-3xl animate-glow-pulse" />
      <div
        className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] rounded-full bg-[#cca044]/15 blur-3xl animate-glow-pulse"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute bottom-10 left-1/4 w-80 h-80 rounded-full bg-[#D37B8C]/15 blur-3xl animate-glow-pulse"
        style={{ animationDelay: "3.5s" }}
      />

      {/* Estrellas y destellos de hadas */}
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full animate-star-twinkle"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            backgroundColor: s.color,
            boxShadow: `0 0 ${s.size * 2}px ${s.color}`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
