"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Sparkles } from "lucide-react";

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Notas de arpegio romántico en tono de ensueño (Pentatónica mayor mágica: Re mayor / Fa# menor)
  const notes = [
    293.66, // D4
    369.99, // F#4
    440.00, // A4
    554.37, // C#5
    587.33, // D5
    739.99, // F#5
    880.00, // A5
  ];

  const playChime = (freq: number, ctx: AudioContext) => {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Envolvente de caja de música/arpa suave
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.07, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 2.5);
    } catch {
      // Manejo silencioso si el contexto fue suspendido
    }
  };

  const startFairyMelody = () => {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContextClass();
    }

    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }

    const ctx = audioCtxRef.current;
    let step = 0;
    const melody = [0, 2, 4, 3, 2, 5, 4, 1, 0, 3, 6, 4];

    // Tocar primera nota
    playChime(notes[melody[0]], ctx);

    intervalRef.current = setInterval(() => {
      step = (step + 1) % melody.length;
      playChime(notes[melody[step]], ctx);
    }, 750);

    setIsPlaying(true);
  };

  const stopFairyMelody = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopFairyMelody();
    } else {
      startFairyMelody();
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={togglePlay}
        type="button"
        aria-label={isPlaying ? "Pausar música ambiental" : "Reproducir música ambiental de cuento de hadas"}
        className={`group relative flex items-center gap-2.5 px-4 py-2.5 rounded-full transition-all duration-300 shadow-xl border ${
          isPlaying
            ? "bg-[#2A0C1A]/90 text-[#F5E8D8] border-[#D4AF37]/60 shadow-[0_0_20px_rgba(212,175,55,0.35)]"
            : "bg-[#18050E]/80 text-[#D9BDB5] hover:text-[#FAF6F0] border-[#D4AF37]/20 hover:border-[#D4AF37]/40"
        } backdrop-blur-md`}
      >
        <span className="relative flex h-3 w-3">
          {isPlaying && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75" />
          )}
          <span
            className={`relative inline-flex rounded-full h-3 w-3 ${
              isPlaying ? "bg-[#D4AF37]" : "bg-[#631C3B]"
            }`}
          />
        </span>

        {isPlaying ? (
          <Volume2 className="w-4 h-4 text-[#D4AF37] animate-pulse" />
        ) : (
          <VolumeX className="w-4 h-4 text-[#D9BDB5]" />
        )}

        <span className="text-xs font-medium tracking-wide">
          {isPlaying ? "Música de Ensueño" : "Música Ambiental"}
        </span>

        {isPlaying && (
          <Sparkles className="w-3.5 h-3.5 text-[#F3E5AB] animate-star-twinkle" />
        )}
      </button>
    </div>
  );
}
