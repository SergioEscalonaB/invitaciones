"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, Heart } from "lucide-react";

interface CountdownTimerProps {
  targetDateStr?: string;
  celebrantName: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
  isToday: boolean;
}

export function CountdownTimer({
  targetDateStr,
  celebrantName,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining | null>(null);
  const [isValidDate, setIsValidDate] = useState<boolean>(true);

  useEffect(() => {
    if (!targetDateStr) {
      setIsValidDate(false);
      return;
    }

    const targetDate = new Date(targetDateStr).getTime();
    if (isNaN(targetDate)) {
      setIsValidDate(false);
      return;
    }

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        // Verificar si es el mismo día (dentro de las 24 horas siguientes)
        const isToday = difference > -86400000;
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isPast: !isToday,
          isToday,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isPast: false,
        isToday: false,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [targetDateStr]);

  if (!isValidDate || !timeLeft) {
    return null;
  }

  if (timeLeft.isToday) {
    return (
      <div className="my-8 p-6 rounded-2xl glass-panel text-center max-w-lg mx-auto border-[#D4AF37]/40 shadow-2xl">
        <div className="flex justify-center mb-2">
          <Sparkles className="w-6 h-6 text-[#D4AF37] animate-bounce" />
        </div>
        <h3 className="font-display-cinzel text-2xl md:text-3xl text-gold-gradient font-bold tracking-wider mb-2">
          ¡Hoy es la Noche Mágica!
        </h3>
        <p className="text-sm md:text-base text-[#F7E2E6] font-light">
          Celebramos con inmensa alegría los Quince Años de {celebrantName}.
        </p>
      </div>
    );
  }

  if (timeLeft.isPast) {
    return (
      <div className="my-6 p-4 rounded-xl glass-panel-subtle text-center max-w-md mx-auto">
        <p className="text-xs text-[#EFC7CF]/80 flex items-center justify-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]/50" />
          Celebrando los quince años de {celebrantName}
        </p>
      </div>
    );
  }

  const units = [
    { label: "Días", value: timeLeft.days },
    { label: "Horas", value: timeLeft.hours },
    { label: "Minutos", value: timeLeft.minutes },
    { label: "Segundos", value: timeLeft.seconds },
  ];

  return (
    <section
      aria-label="Cuenta regresiva para la fiesta"
      className="my-10 w-full max-w-xl mx-auto"
    >
      <div className="text-center mb-4">
        <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-medium">
          Cuenta Regresiva
        </span>
        <h3 className="font-serif-cormorant italic text-xl md:text-2xl text-[#FAF6F0] mt-1">
          Cada segundo nos acerca a una noche inolvidable
        </h3>
      </div>

      <div className="grid grid-cols-4 gap-2.5 sm:gap-4 px-2">
        {units.map((unit, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl glass-panel relative overflow-hidden group hover:border-[#D4AF37]/50 transition-colors"
          >
            {/* Brillo ornamental superior */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />

            <span className="font-display-cinzel text-2xl sm:text-4xl font-bold text-gold-gradient tracking-tight">
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="text-[10px] sm:text-xs tracking-wider uppercase text-[#EFC7CF]/90 mt-1 font-medium">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
