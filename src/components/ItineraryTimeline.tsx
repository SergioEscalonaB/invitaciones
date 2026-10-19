"use client";

import React from "react";
import { Church, Sparkles, Music, Utensils, PartyPopper } from "lucide-react";
import { ItineraryItem } from "@/types/invitation";

interface ItineraryTimelineProps {
  items: ItineraryItem[];
}

export function ItineraryTimeline({ items }: ItineraryTimelineProps) {
  const getIcon = (iconName: ItineraryItem["iconName"]) => {
    switch (iconName) {
      case "church":
        return <Church className="w-5 h-5" />;
      case "sparkles":
        return <Sparkles className="w-5 h-5" />;
      case "music":
        return <Music className="w-5 h-5" />;
      case "utensils":
        return <Utensils className="w-5 h-5" />;
      case "party":
        return <PartyPopper className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <section className="w-full max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-medium block">
          El Cronograma Mágico
        </span>
        <h2 className="font-serif-cormorant text-3xl sm:text-4xl font-bold text-[#FAF6F0] mt-2">
          Itinerario de la Noche
        </h2>
        <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-3" />
      </div>

      <div className="relative pl-6 sm:pl-8 border-l-2 border-[#D4AF37]/30 space-y-8 ml-4 sm:ml-8">
        {items.map((item, idx) => (
          <div key={idx} className="relative group">
            {/* Nodo brillante en la línea de tiempo */}
            <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-8 h-8 rounded-full bg-[#2C0B18] border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.4)] group-hover:scale-110 group-hover:bg-[#441328] transition-all">
              {getIcon(item.iconName)}
            </div>

            <div className="glass-panel p-5 rounded-2xl group-hover:border-[#D4AF37]/50 transition-all">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-xs font-semibold text-[#F3E5AB] mb-1.5">
                {item.time}
              </span>
              <h3 className="font-serif-cormorant text-xl sm:text-2xl font-bold text-[#FAF6F0]">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#EFC7CF] mt-1 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
