import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Sparkles } from "lucide-react";

interface CrystalLotusProps {
  onComplete: () => void;
  playChime: (freq: number) => void;
}

export const CrystalLotus: React.FC<CrystalLotusProps> = ({ onComplete, playChime }) => {
  const [bloomStep, setBloomStep] = useState<number>(0);
  const totalSteps = 6; // 6 layers of petals to bloom
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Frequencies for the magical chime progression
  const chimeFreqs = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 1046.50];

  const handleBloomClick = () => {
    if (bloomStep < totalSteps) {
      const nextStep = bloomStep + 1;
      setBloomStep(nextStep);
      
      // Play a beautiful, escalating crystal glass chime
      playChime(chimeFreqs[bloomStep % chimeFreqs.length]);

      if (nextStep === totalSteps) {
        setIsCompleted(true);
        // Play final double success arpeggio
        setTimeout(() => {
          playChime(1046.50);
        }, 150);
      }
    }
  };

  // Outer petals coordinates (for decorative rotation)
  const outerPetals = Array.from({ length: 12 }).map((_, i) => (i * 30));
  const middlePetals = Array.from({ length: 8 }).map((_, i) => (i * 45 + 15));
  const innerPetals = Array.from({ length: 6 }).map((_, i) => (i * 60 + 30));

  return (
    <div id="crystal-lotus-stage" className="flex flex-col items-center select-none w-full relative">
      
      {/* Glass Pedestal & Liquid Silver Pool */}
      <div className="relative w-72 h-72 flex items-center justify-center mb-8">
        
        {/* Shimmering Liquid Silver Pool Base */}
        <div 
          className="absolute rounded-full w-64 h-16 bg-gradient-to-r from-slate-400 via-white to-slate-500 shadow-[0_15px_30px_rgba(255,255,255,0.1),inset_0_2px_4px_rgba(255,255,255,0.4)] transition-all duration-700"
          style={{
            transform: "rotateX(72deg) translateY(60px)",
            filter: "blur(0.5px)",
          }}
        >
          {/* Shimmering pool ripples */}
          <div className="absolute inset-2 rounded-full border border-white/40 animate-pulse" />
          <div className="absolute inset-4 rounded-full border border-white/20 animate-ping duration-[4000ms]" />
        </div>

        {/* Stem of the Lotus rising from liquid silver */}
        <div 
          className="absolute w-2 h-20 bg-gradient-to-t from-cyan-400/40 via-purple-400/50 to-pink-400/60"
          style={{
            transform: "translateY(20px)",
            borderRadius: "4px",
            filter: "drop-shadow(0 0 8px rgba(168, 85, 247, 0.4))"
          }}
        />

        {/* 
          LOTUS CONTAINER 
          Using rotateX to tilt the lotus slightly for a 3D perspective
        */}
        <div 
          className="relative w-64 h-64 flex items-center justify-center transition-all duration-500"
          style={{
            perspective: "1000px",
            transform: "rotateX(20deg)",
            transformStyle: "preserve-3d"
          }}
        >
          {/* Outer Layer Petals (Blooms at Step >= 1) */}
          {outerPetals.map((angle, idx) => {
            const isBloomed = bloomStep >= 1;
            return (
              <motion.div
                key={`outer-${idx}`}
                className="absolute origin-bottom pointer-events-none"
                style={{
                  width: "28px",
                  height: "75px",
                  bottom: "50%",
                  left: "calc(50% - 14px)",
                  background: "linear-gradient(to top, rgba(236, 72, 153, 0.1) 0%, rgba(217, 70, 239, 0.35) 60%, rgba(192, 132, 252, 0.8) 100%)",
                  borderRadius: "50% 50% 20% 20% / 60% 60% 40% 40%",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  boxShadow: "0 0 15px rgba(217, 70, 239, 0.15), inset 0 1px 2px rgba(255,255,255,0.3)",
                  transformOrigin: "bottom center",
                  backfaceVisibility: "hidden",
                }}
                animate={{
                  rotateZ: angle,
                  rotateX: isBloomed ? 62 : 12,
                  translateY: isBloomed ? 12 : 0,
                  scale: isBloomed ? 1.05 : 0.4,
                  opacity: bloomStep >= 1 ? 0.9 : 0.2,
                }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              />
            );
          })}

          {/* Middle Layer Petals (Blooms at Step >= 2) */}
          {middlePetals.map((angle, idx) => {
            const isBloomed = bloomStep >= 3;
            return (
              <motion.div
                key={`mid-${idx}`}
                className="absolute origin-bottom pointer-events-none"
                style={{
                  width: "24px",
                  height: "65px",
                  bottom: "50%",
                  left: "calc(50% - 12px)",
                  background: "linear-gradient(to top, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.4) 60%, rgba(165, 180, 252, 0.85) 100%)",
                  borderRadius: "50% 50% 20% 20% / 60% 60% 40% 40%",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 0 12px rgba(168, 85, 247, 0.2), inset 0 1px 2px rgba(255,255,255,0.35)",
                  transformOrigin: "bottom center",
                  backfaceVisibility: "hidden",
                }}
                animate={{
                  rotateZ: angle,
                  rotateX: isBloomed ? 46 : 8,
                  translateY: isBloomed ? 8 : 0,
                  scale: bloomStep >= 2 ? 1 : 0.2,
                  opacity: bloomStep >= 2 ? 0.95 : 0,
                }}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              />
            );
          })}

          {/* Inner Layer Petals (Blooms at Step >= 4) */}
          {innerPetals.map((angle, idx) => {
            const isBloomed = bloomStep >= 5;
            return (
              <motion.div
                key={`inner-${idx}`}
                className="absolute origin-bottom pointer-events-none"
                style={{
                  width: "20px",
                  height: "55px",
                  bottom: "50%",
                  left: "calc(50% - 10px)",
                  background: "linear-gradient(to top, rgba(165, 180, 252, 0.15) 0%, rgba(139, 92, 246, 0.5) 65%, rgba(253, 224, 71, 0.9) 100%)",
                  borderRadius: "50% 50% 20% 20% / 60% 60% 40% 40%",
                  border: "1px solid rgba(255, 255, 255, 0.4)",
                  boxShadow: "0 0 10px rgba(139, 92, 246, 0.25), inset 0 1px 2px rgba(255,255,255,0.4)",
                  transformOrigin: "bottom center",
                  backfaceVisibility: "hidden",
                }}
                animate={{
                  rotateZ: angle,
                  rotateX: isBloomed ? 28 : 4,
                  translateY: isBloomed ? 4 : 0,
                  scale: bloomStep >= 4 ? 0.95 : 0,
                  opacity: bloomStep >= 4 ? 1 : 0,
                }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              />
            );
          })}

          {/* 
            BLOOMING CORE 
            Inside the lotus, a floating, brilliantly glowing neon-ruby heart pulses.
          */}
          <AnimatePresence>
            {isCompleted && (
              <motion.div
                className="absolute flex items-center justify-center pointer-events-none"
                initial={{ opacity: 0, scale: 0, y: 10 }}
                animate={{ 
                  opacity: 1, 
                  scale: [1, 1.15, 1],
                  y: -30,
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ 
                  y: { duration: 1.2, ease: "easeOut" },
                  scale: { repeat: Infinity, duration: 1.1, ease: "easeInOut" },
                  opacity: { duration: 0.8 }
                }}
                style={{
                  filter: "drop-shadow(0 0 20px rgba(236, 72, 153, 0.95)) drop-shadow(0 0 40px rgba(217, 70, 239, 0.6))",
                }}
              >
                <div className="relative">
                  {/* Outer breathing aura */}
                  <div className="absolute inset-0 rounded-full bg-pink-500/25 blur-xl animate-pulse" />
                  <Heart className="w-16 h-16 text-pink-500 fill-pink-500" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Touch/Click Action Spot */}
      <div className="relative z-10 flex flex-col items-center">
        {!isCompleted ? (
          <button
            onClick={handleBloomClick}
            className="px-8 py-3.5 rounded-full border border-pink-500/35 bg-gradient-to-r from-pink-900/40 via-purple-900/40 to-cyan-900/40 hover:from-pink-800/50 hover:to-cyan-800/50 active:scale-95 transition-all text-white font-serif tracking-wide text-sm shadow-[0_10px_25px_rgba(217,70,239,0.15)] flex items-center gap-2.5 cursor-pointer hover:border-pink-400/60"
          >
            <Sparkles className="w-4 h-4 text-pink-300 animate-spin" />
            <span>
              {bloomStep === 0 
                ? "Awaken the Crystal Lotus 🌸" 
                : `Petals Blooming (${bloomStep}/${totalSteps})`}
            </span>
          </button>
        ) : (
          <button
            onClick={onComplete}
            className="px-10 py-4 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-slate-950 font-bold text-xs tracking-widest uppercase transition-all shadow-[0_15px_30px_rgba(245,158,11,0.25)] hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2 border border-amber-300/30"
          >
            <span>Send Wish to the Stars ✨</span>
          </button>
        )}

        <p className="text-slate-400 text-xs font-sans mt-4 max-w-xs text-center leading-relaxed">
          {!isCompleted 
            ? "Tap the trigger multiple times to bloom the crystal petals with exquisite glass-chime resonance."
            : "The Sacred Crystal Lotus has blossomed fully, revealing the bioluminescent neon-ruby heart of devotion."}
        </p>
      </div>

    </div>
  );
};
