import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Sparkles, Heart } from "lucide-react";

interface InteractiveCakeProps {
  candleExtinguished: boolean;
  onExtinguish: () => void;
}

export const InteractiveCake: React.FC<InteractiveCakeProps> = ({
  candleExtinguished,
  onExtinguish,
}) => {
  // Animation states for the 3D baking phases
  const [buttonActive, setButtonActive] = useState(candleExtinguished);
  const [tier1Active, setTier1Active] = useState(candleExtinguished);
  const [tier2Active, setTier2Active] = useState(candleExtinguished);
  const [tier3Active, setTier3Active] = useState(candleExtinguished);
  const [candlesActive, setCandlesActive] = useState(candleExtinguished);
  const [flameActive, setFlameActive] = useState(false);

  const [muted, setMuted] = useState(true);
  const [straining, setStraining] = useState(false);

  // 3D Rotation Physics
  const [rotationY, setRotationY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef(0);

  // Audio refs for celebration sounds
  const soundsRef = useRef<{
    CHEER: HTMLAudioElement;
    MATCH: HTMLAudioElement;
    TUNE: HTMLAudioElement;
    ON: HTMLAudioElement;
    BLOW: HTMLAudioElement;
    POP: HTMLAudioElement;
    HORN: HTMLAudioElement;
  } | null>(null);

  // Initialize sounds on client side
  useEffect(() => {
    soundsRef.current = {
      CHEER: new Audio("https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/cheer.mp3"),
      MATCH: new Audio("https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/match-strike-trimmed.mp3"),
      TUNE: new Audio("https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/happy-birthday-trimmed.mp3"),
      ON: new Audio("https://assets.codepen.io/605876/switch-on.mp3"),
      BLOW: new Audio("https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/blow-out.mp3"),
      POP: new Audio("https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/pop-trimmed.mp3"),
      HORN: new Audio("https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/horn.mp3"),
    };

    if (soundsRef.current) {
      soundsRef.current.TUNE.loop = false;
    }

    // Sync initial state if already extinguished
    if (candleExtinguished) {
      setButtonActive(true);
      setTier1Active(true);
      setTier2Active(true);
      setTier3Active(true);
      setCandlesActive(true);
      setFlameActive(false);
    }

    return () => {
      if (soundsRef.current) {
        (Object.values(soundsRef.current) as HTMLAudioElement[]).forEach((audio) => {
          audio.pause();
          audio.currentTime = 0;
        });
      }
    };
  }, [candleExtinguished]);

  // Sync mute state to audio elements
  useEffect(() => {
    if (soundsRef.current) {
      (Object.values(soundsRef.current) as HTMLAudioElement[]).forEach((audio) => {
        audio.muted = muted;
      });
    }
  }, [muted]);

  // Auto-rotation when not dragging
  useEffect(() => {
    if (isDragging) return;
    let animationFrameId: number;
    const tick = () => {
      setRotationY((prev) => (prev + 0.35) % 360);
      animationFrameId = requestAnimationFrame(tick);
    };
    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isDragging]);

  const playSound = (name: keyof NonNullable<typeof soundsRef.current>) => {
    const audio = soundsRef.current?.[name];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch((err) => {
        console.warn("Audio playback blocked/failed:", err?.message || String(err));
      });
    }
  };

  const handleStartCelebration = () => {
    if (buttonActive) return;

    setButtonActive(true);
    playSound("ON");
    playSound("CHEER");
    playSound("HORN");

    // Phase 1: Rise Tier 1 (Base chocolate tier)
    setTimeout(() => {
      setTier1Active(true);
      playSound("POP");
    }, 400);

    // Phase 2: Rise Tier 2 (Middle strawberry tier)
    setTimeout(() => {
      setTier2Active(true);
      playSound("POP");
    }, 1100);

    // Phase 3: Rise Tier 3 (Top royal vanilla tier)
    setTimeout(() => {
      setTier3Active(true);
      playSound("POP");
    }, 1800);

    // Phase 4: Show 3D candles
    setTimeout(() => {
      setCandlesActive(true);
      playSound("POP");
    }, 2500);

    // Phase 5: Light candles with strike match flame
    setTimeout(() => {
      setFlameActive(true);
      playSound("MATCH");
      setTimeout(() => {
        playSound("TUNE");
      }, 600);
    }, 3500);
  };

  const handleBlowOut = () => {
    if (!flameActive || straining) return;

    setStraining(true);
    playSound("BLOW");

    setTimeout(() => {
      setFlameActive(false);
      setStraining(false);
      onExtinguish();
    }, 850);
  };

  // Drag Physics Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current;
    setRotationY((prev) => prev + deltaX * 0.6);
    dragStartRef.current = e.clientX;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    dragStartRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - dragStartRef.current;
    setRotationY((prev) => prev + deltaX * 0.6);
    dragStartRef.current = e.touches[0].clientX;
  };

  // Generator for beautiful 3D cylindrical segments
  const renderCylinderSegments = (
    radius: number,
    height: number,
    spongeStyle: string,
    topColor: string
  ) => {
    const segments = 12;
    const angleStep = 360 / segments;
    const radStep = (Math.PI / 180) * angleStep;
    // Overlap width slightly to avoid hairline rendering gaps in browser
    const segmentWidth = 2 * radius * Math.sin(radStep / 2) + 1.2;
    const translateZ = radius * Math.cos(radStep / 2) - 0.2;

    return (
      <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
        {/* Side Panels */}
        {Array.from({ length: segments }).map((_, i) => {
          const angle = i * angleStep;
          const rad = (angle * Math.PI) / 180;
          // Calculate realistic specular lighting brightness factor based on angle
          const brightness = 0.68 + 0.32 * Math.cos(rad - Math.PI / 4);

          return (
            <div
              key={i}
              className="absolute origin-center"
              style={{
                width: `${segmentWidth}px`,
                height: `${height}px`,
                left: `calc(50% - ${segmentWidth / 2}px)`,
                top: "0px",
                transform: `rotateY(${angle}deg) translateZ(${translateZ}px)`,
                background: spongeStyle,
                filter: `brightness(${brightness})`,
                backfaceVisibility: "hidden",
                borderLeft: "0.5px solid rgba(255,255,255,0.06)",
                borderRight: "0.5px solid rgba(0,0,0,0.12)",
              }}
            />
          );
        })}

        {/* Top Flat Circle */}
        <div
          className="absolute rounded-full"
          style={{
            width: `${radius * 2}px`,
            height: `${radius * 2}px`,
            left: `calc(50% - ${radius}px)`,
            top: `calc(50% - ${radius}px)`,
            transform: `rotateX(90deg) translateZ(${height / 2}px)`,
            background: topColor,
            boxShadow: "inset 0 0 15px rgba(0,0,0,0.15)",
            backfaceVisibility: "hidden",
          }}
        >
          {/* Flat Sprinkles on top surface */}
          {Array.from({ length: 8 }).map((_, idx) => {
            const sprinkleR = radius * 0.6;
            const theta = (idx * 45 * Math.PI) / 180;
            const sx = sprinkleR * Math.cos(theta);
            const sy = sprinkleR * Math.sin(theta);
            const colors = ["#F472B6", "#A78BFA", "#38BDF8", "#F59E0B", "#34D399", "#EC4899"];
            return (
              <div
                key={idx}
                className="absolute rounded-full"
                style={{
                  width: "4px",
                  height: "10px",
                  left: `calc(50% + ${sx}px - 2px)`,
                  top: `calc(50% + ${sy}px - 5px)`,
                  backgroundColor: colors[idx % colors.length],
                  transform: `rotateZ(${idx * 30}deg)`,
                }}
              />
            );
          })}

          {/* 3D Clay Frosting Pearls along the rim */}
          {Array.from({ length: 12 }).map((_, idx) => {
            const pearlR = radius * 0.92;
            const theta = (idx * 30 * Math.PI) / 180;
            const px = pearlR * Math.cos(theta);
            const py = pearlR * Math.sin(theta);
            return (
              <div
                key={`pearl-${idx}`}
                className="absolute rounded-full"
                style={{
                  width: "7px",
                  height: "7px",
                  left: `calc(50% + ${px}px - 3.5px)`,
                  top: `calc(50% + ${py}px - 3.5px)`,
                  background: "radial-gradient(circle at 35% 35%, #FFFFFF 0%, #FCE7F3 60%, #F472B6 100%)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.18)",
                }}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center select-none w-full relative">
      
      {/* Absolute Sound Toggle Control */}
      <button
        onClick={() => setMuted(!muted)}
        className={`absolute -top-4 right-0 px-4 py-2 rounded-[20px] border border-white/80 transition-all duration-300 cursor-pointer shadow-clayButton active:scale-[0.92] active:shadow-clayPressed flex items-center justify-center gap-2 text-xs font-heading tracking-wider font-extrabold z-20 ${
          muted 
            ? "bg-white/90 text-[#DB2777]" 
            : "bg-white/90 text-emerald-700"
        }`}
        title={muted ? "Unmute sound effects & music" : "Mute sound effects & music"}
      >
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${muted ? "bg-rose-400" : "bg-emerald-400"}`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${muted ? "bg-rose-500" : "bg-emerald-500"}`}></span>
        </span>
        {muted ? (
          <>
            <VolumeX className="w-4 h-4 text-[#DB2777]" />
            <span>SFX: OFF</span>
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>SFX: ON</span>
          </>
        )}
      </button>

      {/* 
        HIGH-FIDELITY CLAY EXHIBITION CAPSULE / DISPLAY DOME
      */}
      <div 
        className="w-full relative rounded-[40px] bg-[#F8F6FC] border border-white/90 p-8 md:p-12 shadow-clayPressed overflow-hidden transition-all duration-500 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUpOrLeave}
      >
        
        {/* Soft Radial Ambient Clay Glow inside the Cake Backing */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-pink-100/40 pointer-events-none" />
        <div className="absolute top-[10%] left-[10%] w-[80%] h-[80%] rounded-full bg-[#EC4899]/8 blur-3xl pointer-events-none" />

        {/* 
          3D ENGINE CONTAINER/STAGE
          Contains CSS 3D nested layers. Tilts along the X-axis for realistic projection.
        */}
        <div 
          className="w-full h-80 flex items-center justify-center relative select-none"
          style={{
            perspective: "1200px",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Rotating Turntable Base */}
          <div
            className="relative w-72 h-72 flex items-center justify-center transition-transform duration-100 ease-out"
            style={{
              transform: `rotateX(-18deg) rotateY(${rotationY}deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            
            {/* Clay Pedestal Plate Base */}
            <div
              className="absolute rounded-full"
              style={{
                width: "220px",
                height: "220px",
                background: "radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(244, 241, 250, 0.85) 60%, rgba(223, 212, 240, 0.5) 100%)",
                boxShadow: "12px 12px 24px rgba(160, 150, 180, 0.25), -12px -12px 24px rgba(255, 255, 255, 0.95), inset 3px 3px 6px rgba(255, 255, 255, 0.9)",
                transform: "rotateX(90deg) translateZ(-46px)",
                transformStyle: "preserve-3d",
              }}
            />

            {/* Elegant Soft Shadow Base */}
            <div
              className="absolute rounded-full"
              style={{
                width: "200px",
                height: "200px",
                background: "radial-gradient(circle, rgba(219, 39, 119, 0.22) 0%, transparent 70%)",
                transform: "rotateX(90deg) translateZ(-52px)",
                filter: "blur(10px)",
                transformStyle: "preserve-3d",
              }}
            />

            {/* 2. TIER 1: LUSCIOUS BERRY PURPLE CLAY VELVET BASE */}
            {buttonActive && (
              <div
                className="absolute transition-all duration-1000 ease-out"
                style={{
                  width: "180px",
                  height: "55px",
                  transform: `translateY(20px) scaleY(${tier1Active ? 1 : 0})`,
                  transformOrigin: "bottom center",
                  transformStyle: "preserve-3d",
                }}
              >
                {renderCylinderSegments(
                  90, // Radius
                  55, // Height
                  "linear-gradient(to bottom, #A78BFA 0%, #A78BFA 30%, #7C3AED 30%, #7C3AED 45%, #FFFFFF 45%, #FFFFFF 58%, #7C3AED 58%, #7C3AED 100%)",
                  "#F5F3FF"
                )}
              </div>
            )}

            {/* 3. TIER 2: STRAWBERRY ROSE VELVET MID-LAYER */}
            {tier1Active && (
              <div
                className="absolute transition-all duration-1000 ease-out"
                style={{
                  width: "130px",
                  height: "45px",
                  transform: `translateY(-25px) scaleY(${tier2Active ? 1 : 0})`,
                  transformOrigin: "bottom center",
                  transformStyle: "preserve-3d",
                }}
              >
                {renderCylinderSegments(
                  65, // Radius
                  45, // Height
                  "linear-gradient(to bottom, #F472B6 0%, #F472B6 30%, #E11D48 30%, #E11D48 45%, #FFFFFF 45%, #FFFFFF 58%, #E11D48 58%, #E11D48 100%)", // Pink velvet layers
                  "#FCE7F3" // Top icing
                )}
              </div>
            )}

            {/* 4. TIER 3: ROYAL VANILLA CREAM TOP TIER */}
            {tier2Active && (
              <div
                className="absolute transition-all duration-1000 ease-out"
                style={{
                  width: "80px",
                  height: "40px",
                  transform: `translateY(-67px) scaleY(${tier3Active ? 1 : 0})`,
                  transformOrigin: "bottom center",
                  transformStyle: "preserve-3d",
                }}
              >
                {renderCylinderSegments(
                  40, // Radius
                  40, // Height
                  "linear-gradient(to bottom, #FFFBEB 0%, #FFFBEB 30%, #FDE68A 30%, #FDE68A 50%, #FFFFFF 50%, #FFFFFF 60%, #FDE68A 60%, #FDE68A 100%)",
                  "#FFFDF5"
                )}
              </div>
            )}

            {/* 5. MAGICAL 3D CANDLES (Standing vertically perpendicular on the top tier) */}
            {tier3Active && (
              <div
                className="absolute inset-0 pointer-events-none transition-all duration-700"
                style={{
                  transform: `scaleY(${candlesActive ? 1 : 0})`,
                  transformOrigin: "bottom center",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Candle 1 (Back Center - Rose Clay) */}
                <div
                  className="absolute"
                  style={{
                    width: "7px",
                    height: "34px",
                    left: "calc(50% - 3.5px)",
                    top: "calc(50% - 17px)",
                    background: "repeating-linear-gradient(45deg, #F472B6, #F472B6 4px, #FFFFFF 4px, #FFFFFF 8px)",
                    borderRadius: "3px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                    transform: "translateY(-98px) translateZ(-16px)",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Glowing Flame */}
                  {flameActive && (
                    <div
                      className="absolute animate-flicker"
                      style={{
                        width: "11px",
                        height: "17px",
                        background: "radial-gradient(circle, #FFFBEB 15%, #FBBF24 60%, #F97316 100%)",
                        borderRadius: "50% 50% 20% 20% / 60% 60% 40% 40%",
                        left: "-2px",
                        top: "-17px",
                        filter: "drop-shadow(0 0 6px rgba(249, 115, 22, 0.95))",
                        transformOrigin: "bottom center",
                      }}
                    />
                  )}
                </div>

                {/* Candle 2 (Front Left - Purple Clay) */}
                <div
                  className="absolute"
                  style={{
                    width: "7px",
                    height: "34px",
                    left: "calc(50% - 3.5px)",
                    top: "calc(50% - 17px)",
                    background: "repeating-linear-gradient(45deg, #A78BFA, #A78BFA 4px, #FFFFFF 4px, #FFFFFF 8px)",
                    borderRadius: "3px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                    transform: "translateY(-98px) translateZ(12px) translateX(-14px)",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Glowing Flame */}
                  {flameActive && (
                    <div
                      className="absolute animate-flicker"
                      style={{
                        width: "11px",
                        height: "17px",
                        background: "radial-gradient(circle, #FFFBEB 15%, #FBBF24 60%, #F97316 100%)",
                        borderRadius: "50% 50% 20% 20% / 60% 60% 40% 40%",
                        left: "-2px",
                        top: "-17px",
                        filter: "drop-shadow(0 0 6px rgba(249, 115, 22, 0.95))",
                        transformOrigin: "bottom center",
                        animationDelay: "0.06s",
                      }}
                    />
                  )}
                </div>

                {/* Candle 3 (Front Right - Mint Clay) */}
                <div
                  className="absolute"
                  style={{
                    width: "7px",
                    height: "34px",
                    left: "calc(50% - 3.5px)",
                    top: "calc(50% - 17px)",
                    background: "repeating-linear-gradient(45deg, #34D399, #34D399 4px, #FFFFFF 4px, #FFFFFF 8px)",
                    borderRadius: "3px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                    transform: "translateY(-98px) translateZ(12px) translateX(14px)",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Glowing Flame */}
                  {flameActive && (
                    <div
                      className="absolute animate-flicker"
                      style={{
                        width: "11px",
                        height: "17px",
                        background: "radial-gradient(circle, #FFFBEB 15%, #FBBF24 60%, #F97316 100%)",
                        borderRadius: "50% 50% 20% 20% / 60% 60% 40% 40%",
                        left: "-2px",
                        top: "-17px",
                        filter: "drop-shadow(0 0 6px rgba(249, 115, 22, 0.95))",
                        transformOrigin: "bottom center",
                        animationDelay: "0.12s",
                      }}
                    />
                  )}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* 3D Cake Drag Navigation hint */}
        {buttonActive && (
          <div className="absolute bottom-3 text-center select-none pointer-events-none text-[11px] font-heading tracking-wider text-[#635F69] font-bold uppercase animate-pulse">
            Swipe left or right to orbit the 3D cake
          </div>
        )}

        {/* Main Activation Trigger Button */}
        {!buttonActive && (
          <button
            onClick={handleStartCelebration}
            className="mt-6 h-14 px-10 rounded-[20px] bg-gradient-to-r from-[#F472B6] to-[#E11D48] text-white font-heading font-extrabold text-xs tracking-wider uppercase shadow-clayButton hover:shadow-clayButtonHover active:scale-[0.92] active:shadow-clayPressed transition-all flex items-center gap-2.5 cursor-pointer relative z-10"
          >
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
            <span>Bake Your 3D Cake</span>
          </button>
        )}

        {/* Hotspot blow trigger button positioned cleanly lower near the cake base */}
        {flameActive && (
          <button
            onClick={handleBlowOut}
            className="absolute bottom-10 px-8 py-3 rounded-[20px] bg-gradient-to-r from-[#F472B6] to-[#E11D48] text-white font-heading font-black text-xs tracking-wider uppercase shadow-clayButton hover:shadow-clayButtonHover active:scale-[0.92] active:shadow-clayPressed transition-all flex items-center gap-2.5 cursor-pointer z-20 animate-bounce group"
            title="Click to blow out the candles!"
          >
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
            <span>Click to Blow Out Candles</span>
          </button>
        )}

        {/* Smoke trail on blow out */}
        {!flameActive && candleExtinguished && (
          <div className="absolute bottom-36 flex justify-around w-16 pointer-events-none z-10">
            <div className="w-1.5 h-10 bg-[#332F3A]/20 rounded-full filter blur-xs animate-smoke" style={{ animationDelay: "0s" }} />
            <div className="w-1 h-14 bg-[#332F3A]/15 rounded-full filter blur-xs animate-smoke" style={{ animationDelay: "0.25s" }} />
          </div>
        )}
      </div>

      {/* Modern, elegant clay status line */}
      <div className="min-h-12 flex items-center justify-center text-center mt-6 z-10">
        {!buttonActive && (
          <p className="text-[#635F69] text-xs font-heading font-extrabold tracking-wide flex items-center gap-2 px-6 py-3 rounded-[24px] bg-white/80 border border-white/80 shadow-clayCard">
            Click the button inside the capsule to bake the Birthday cake for Iffat!
          </p>
        )}
        {buttonActive && !tier1Active && (
          <p className="text-[#DB2777] text-xs font-heading font-extrabold tracking-wider animate-pulse px-6 py-3 rounded-[24px] bg-white/80 border border-white/80 shadow-clayCard">
            Sponge layer baking...
          </p>
        )}
        {tier1Active && !tier2Active && (
          <p className="text-[#E11D48] text-xs font-heading font-extrabold tracking-wider animate-pulse px-6 py-3 rounded-[24px] bg-white/80 border border-white/80 shadow-clayCard">
            Pouring fresh strawberry velvet glaze & toppings...
          </p>
        )}
        {tier2Active && !tier3Active && (
          <p className="text-amber-700 text-xs font-heading font-extrabold tracking-wider animate-pulse px-6 py-3 rounded-[24px] bg-white/80 border border-white/80 shadow-clayCard">
            Adding royal vanilla cream crown...
          </p>
        )}
        {tier3Active && !candlesActive && (
          <p className="text-emerald-700 text-xs font-heading font-extrabold tracking-wider animate-pulse px-6 py-3 rounded-[24px] bg-white/80 border border-white/80 shadow-clayCard">
            Applying magical lit candles...
          </p>
        )}
        {flameActive && (
          <p className="text-[#332F3A] text-xs font-heading font-extrabold tracking-wide flex items-center gap-2 bg-white/90 border border-white/90 px-6 py-3 rounded-[24px] shadow-clayCard animate-pulse">
            Make a silent wish, close your eyes, and blow out the candles!
          </p>
        )}
        {candleExtinguished && !flameActive && (
          <p className="text-emerald-700 text-xs font-heading font-extrabold tracking-wide flex items-center gap-2 bg-emerald-50/90 border border-emerald-100 px-6 py-3 rounded-[24px] shadow-clayCard">
            Happy Birthday Iffat! Aapki har dua qubool ho! Ameen!
          </p>
        )}
      </div>
    </div>
  );
};
