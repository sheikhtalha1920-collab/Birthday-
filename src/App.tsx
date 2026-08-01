import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { InteractiveCake } from "./components/InteractiveCake";
import { 
  Lock, 
  Unlock, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Heart as HeartIcon, 
  ChevronRight, 
  RefreshCw, 
  Compass, 
  Check, 
  Eye,
  Upload,
  Link,
  Edit2
} from "lucide-react";

// Synthesizer with Web Audio API for highly premium mechanical and organic sounds
const playSynthSound = (type: "click" | "correct" | "error" | "sparkle" | "swish" | "ambient") => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    if (type === "click") {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.04);
      gainNode.gain.setValueAtTime(0.05, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === "correct") {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(f, now + idx * 0.06);
        gainNode.gain.setValueAtTime(0, now + idx * 0.06);
        gainNode.gain.linearRampToValueAtTime(0.08, now + idx * 0.06 + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.6);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.7);
      });
    } else if (type === "error") {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc1.type = "sawtooth";
      osc2.type = "triangle";
      osc1.frequency.setValueAtTime(120, now);
      osc2.frequency.setValueAtTime(118, now);
      gainNode.gain.setValueAtTime(0.08, now);
      gainNode.gain.linearRampToValueAtTime(0.001, now + 0.3);
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.3);
      osc2.stop(now + 0.3);
    } else if (type === "sparkle") {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(1800, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.45);
      gainNode.gain.setValueAtTime(0.08, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (type === "swish") {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.type = "triangle";
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.25);
      gainNode.gain.setValueAtTime(0.04, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  } catch (e) {
    console.warn("Synth playback failed:", e instanceof Error ? e.message : String(e));
  }
};

interface PolaroidCard {
  id: number;
  imageUrl: string;
  title: string;
  urduWish: string;
  englishWish: string;
}

const INITIAL_POLAROIDS: PolaroidCard[] = [
  {
    id: 1,
    imageUrl: "https://i.ibb.co/PzctfjwJ/1000495502.jpg",
    title: "Haseen Lamhe",
    urduWish: "Iffat, Khuda kare aapka har aane wala din sunehri yaadon aur be-hisaab khushiyon se mehka ho.",
    englishWish: "Iffat, may your path be brightened with the most beautiful, timeless memories and endless joy."
  },
  {
    id: 2,
    imageUrl: "https://i.ibb.co/Y4MR12fY/1000495503.jpg",
    title: "Muskurati Subah",
    urduWish: "Aapki haseen muskurahat kabhi kam na ho, aur har subah naye umeed aur ujalay lekar aaye.",
    englishWish: "Wishing you a life overflowing with genuine smiles, sweet peaceful mornings, and lovely adventures."
  },
  {
    id: 3,
    imageUrl: "https://i.ibb.co/67ZR1r8T/1000495504.jpg",
    title: "Anmol Tohfa",
    urduWish: "Iffat, aap hamari zindagi ka wo anmol tohfa hain jis se har taraf dheron raunqein aur sukoon hai.",
    englishWish: "Iffat, you are the most precious gift to everyone around you, bringing light and peace to our world."
  },
  {
    id: 4,
    imageUrl: "https://i.ibb.co/7JfVJtBx/1000495505.jpg",
    title: "Sitare aur Khwahishein",
    urduWish: "Sitare bhi aapki khwahishon ke aage sar jhukaen, aur aapka har khwab haqeeqat ka roop dhar le.",
    englishWish: "May the cosmos align to fulfill your deepest dreams, filling your life with stardust and golden luck."
  },
  {
    id: 5,
    imageUrl: "https://i.ibb.co/bjbNRs24/1000495506.jpg",
    title: "Dua-e-Khaas",
    urduWish: "Dil se dua hai keh Iffat ke saare dukh koso door rahein aur kamyabi har qadam par unke qadam choome.",
    englishWish: "My heartfelt prayer for Iffat is lifelong peace, abundance, and success at every single step you take."
  },
  {
    id: 6,
    imageUrl: "https://i.ibb.co/KjXPXTXx/1000495507.jpg",
    title: "Eternal Light",
    urduWish: "Hamesha yuhi muskurate aur chamakte rahein, apni nayab shakhsiyat se sab ke dilon ko jeet'te rahein.",
    englishWish: "Keep shining bright like the elegant soul you are, filling every corner of our hearts with warmth."
  }
];

const AUDIO_SOURCES = [
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/happy-birthday-trimmed.mp3",
  "https://scottholmesmusic.com/wp-content/uploads/Scott_Holmes_Music_-_Happy_Birthday.mp3",
  "https://archive.org/download/happybirthday_202003/Happy%20Birthday.mp3"
];

export default function App() {
  // Navigation scenes state: 1: Keypad, 2: Toggles, 3: Catch Heart, 4: Cake, 5: Polaroid Grid, 6: Final Letter
  const [scene, setScene] = useState<number>(1);
  const [musicPlaying, setMusicPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentAudioIndex, setCurrentAudioIndex] = useState<number>(0);

  // Scene 1: Keypad passcode state
  const [enteredPasscode, setEnteredPasscode] = useState<string>("");
  const [passcodeError, setPasscodeError] = useState<boolean>(false);
  const [lockStatus, setLockStatus] = useState<"locked" | "unlocking" | "unlocked">("locked");

  // Scene 2: Toggles states
  const [ambientLights, setAmbientLights] = useState<boolean>(false);
  const [cinematicMusic, setCinematicMusic] = useState<boolean>(false);
  const [balloonsActive, setBalloonsActive] = useState<boolean>(false);

  // Scene 3: Catch Heart mini game states
  const [heartsCaught, setHeartsCaught] = useState<number>(0);
  const [heartPos, setHeartPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [heartParticles, setHeartParticles] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
  const gameBoundaryRef = useRef<HTMLDivElement | null>(null);

  // Scene 4: Interactive Cake state
  const [cakeExtinguished, setCakeExtinguished] = useState<boolean>(false);

  // Scene 5: Polaroid card state with 6 premium custom images
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [polaroids] = useState<PolaroidCard[]>(INITIAL_POLAROIDS);

  // Scene 6: Typed letter reveal
  const [revealedLetterText, setRevealedLetterText] = useState<string>("");
  const [showAllWords, setShowAllWords] = useState(false);
  const letterBodyText = `Piyari Iffat, Aaj ka yeh sunehra din aapki zindagi mein dheron khushiyan aur bahaar le kar aaye. Salgirah ka yeh khoobsurat mauqa sirf ek saal guzarne ka naam nahi, balkeh us haseen aur anmol ehsaas ka jashan hai jo aap is duniya mein lekar aate hain. Aapki muskurahat, aapki baten aur aapka mizaaj sab ke dilon ko roshan kar deta hai.

Meri dil se dua hai keh aane wala har lamha aapke liye kamyabi, sukoon aur be-had khushiyan lekar aaye. Allah taala aapko har qadam par barkat de, aapke sapnon ko haseen tabeer mile, aur aapki zindagi hamesha doston aur chahne walon ki mohabbat se mehki rahe.

Iffat, aap is duniya ke liye ek behtareen tohfa hain. Hamesha yunhi muskurate rahein, chamakte rahein aur apni anmol shakhsiyat se har taraf roshni phelate rahein. Happy Birthday Iffat!`;

  // General Background stardust and balloons
  const [backgroundStars, setBackgroundStars] = useState<{ id: number; top: number; left: number; size: number; delay: number }[]>([]);
  const [floatingBalloons, setFloatingBalloons] = useState<{ id: number; left: number; delay: number; speed: number; size: number; color: string }[]>([]);
  const [glitterConfetti, setGlitterConfetti] = useState<{ id: number; left: number; delay: number; speed: number; color: string }[]>([]);

  // Setup background star dust on mount
  useEffect(() => {
    const generatedStars = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 3 + 2,
      delay: Math.random() * 4
    }));
    setBackgroundStars(generatedStars);
  }, []);

  // Sync background HTML5 audio stream
  useEffect(() => {
    if (audioRef.current) {
      if (musicPlaying) {
        audioRef.current.play().catch(err => {
          console.log("Audio autoplay was restricted, waiting for user click", err);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [musicPlaying, currentAudioIndex]);

  // Sync scene 2 music toggle directly with ambient sound status
  useEffect(() => {
    setMusicPlaying(cinematicMusic);
  }, [cinematicMusic]);

  // Handle Balloons and Glitter Confetti emission
  useEffect(() => {
    if (balloonsActive) {
      // Vibrant, soft pink & party colors for girls theme
      const colors = [
        "#f43f5e", // Rose
        "#ec4899", // Pink
        "#db2777", // Deep pink
        "#f472b6", // Light pink
        "#a855f7", // Vibrant purple
        "#e11d48", // Crimson rose
        "#fbbf24", // Gold
        "#c084fc", // Pastel violet
        "#f0abfc", // Fuchsia pastel
        "#f43f5e"  // Bright rose
      ];
      const balloons = Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        left: Math.random() * 90 + 5,
        delay: Math.random() * 4,
        speed: Math.random() * 10 + 15,
        size: Math.random() * 18 + 36,
        color: colors[i % colors.length]
      }));
      setFloatingBalloons(balloons);

      // Gold & Pink glitter confetti
      const goldTones = ["#fcd34d", "#fbbf24", "#f472b6", "#fbcfe8", "#fde047", "#f43f5e"];
      const confetti = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 3,
        speed: Math.random() * 5 + 7,
        color: goldTones[i % goldTones.length]
      }));
      setGlitterConfetti(confetti);
    } else {
      setFloatingBalloons([]);
      setGlitterConfetti([]);
    }
  }, [balloonsActive]);

  // Scene 1: Enter passcode handling
  const handleKeyPress = (num: string) => {
    if (lockStatus !== "locked") return;
    playSynthSound("click");
    
    const newPasscode = enteredPasscode + num;
    setEnteredPasscode(newPasscode);

    if (newPasscode.length === 4) {
      if (newPasscode === "0000") {
        setLockStatus("unlocking");
        playSynthSound("correct");
        setTimeout(() => {
          setLockStatus("unlocked");
          setTimeout(() => {
            setScene(2);
          }, 800);
        }, 1100);
      } else {
        setPasscodeError(true);
        playSynthSound("error");
        setTimeout(() => {
          setEnteredPasscode("");
          setPasscodeError(false);
        }, 800);
      }
    }
  };

  const handleBackspace = () => {
    if (enteredPasscode.length > 0 && lockStatus === "locked") {
      playSynthSound("click");
      setEnteredPasscode(enteredPasscode.slice(0, -1));
    }
  };

  const handleClear = () => {
    if (enteredPasscode.length > 0 && lockStatus === "locked") {
      playSynthSound("click");
      setEnteredPasscode("");
    }
  };

  // Scene 3: Catch Heart Mini-game click handler
  const handleHeartClick = (e: React.MouseEvent<HTMLDivElement>) => {
    playSynthSound("sparkle");
    const nextHearts = heartsCaught + 1;
    setHeartsCaught(nextHearts);

    if (gameBoundaryRef.current) {
      const rect = gameBoundaryRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const colors = ["#f43f5e", "#ec4899", "#fbbf24", "#f59e0b", "#f87171"];
      const newSparks = Array.from({ length: 15 }).map((_, i) => ({
        id: Date.now() + i,
        x: clickX,
        y: clickY,
        color: colors[i % colors.length]
      }));
      setHeartParticles(prev => [...prev, ...newSparks]);

      const padding = 50;
      const newX = Math.random() * (rect.width - padding * 2) + padding;
      const newY = Math.random() * (rect.height - padding * 2) + padding;
      setHeartPos({ x: (newX / rect.width) * 100, y: (newY / rect.height) * 100 });
    }

    if (nextHearts === 5) {
      playSynthSound("correct");
      setTimeout(() => {
        setScene(4);
      }, 1200);
    }
  };

  useEffect(() => {
    if (heartParticles.length > 0) {
      const timer = setTimeout(() => {
        setHeartParticles([]);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [heartParticles]);

  // Scene 5: Card Gallery flip action
  const handleCardFlip = (id: number) => {
    playSynthSound("swish");
    if (flippedCards.includes(id)) {
      setFlippedCards(flippedCards.filter(c => c !== id));
    } else {
      setFlippedCards([...flippedCards, id]);
    }
  };

  const allCardsFlipped = flippedCards.length >= 6;

  // Scene 6: Set text instantly for maximum legibility and zero delay
  useEffect(() => {
    if (scene === 6) {
      setRevealedLetterText(letterBodyText);
    }
  }, [scene]);

  const handleResetApp = () => {
    setScene(1);
    setEnteredPasscode("");
    setLockStatus("locked");
    setPasscodeError(false);
    setAmbientLights(false);
    setCinematicMusic(false);
    setBalloonsActive(false);
    setHeartsCaught(0);
    setCakeExtinguished(false);
    setFlippedCards([]);
    setMusicPlaying(false);
    setShowAllWords(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <div 
      id="mystical-birthday-app" 
      className="min-h-screen w-full flex flex-col justify-between font-sans relative overflow-x-hidden select-none transition-colors duration-1000 bg-[#F4F1FA]"
    >
      {/* High-Fidelity Claymorphism Background Blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-[10%] -left-[10%] h-[50vh] w-[50vh] rounded-full bg-[#7C3AED]/10 blur-2xl animate-clay-float transform-gpu" />
        <div className="absolute top-[20%] -right-[10%] h-[50vh] w-[50vh] rounded-full bg-[#EC4899]/10 blur-2xl animate-clay-float-delayed transform-gpu" />
        <div className="absolute -bottom-[10%] left-[20%] h-[50vh] w-[50vh] rounded-full bg-[#0EA5E9]/10 blur-2xl animate-clay-float-slow transform-gpu" />
        <div className="absolute top-[40%] left-[30%] h-[35vh] w-[35vh] rounded-full bg-[#F59E0B]/8 blur-2xl animate-clay-breathe transform-gpu" />
      </div>

      {/* Background soft pink/gold stardust particles */}
      {backgroundStars.map((star) => (
        <div 
          key={star.id} 
          className="absolute rounded-full bg-pink-300/70 pointer-events-none" 
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            boxShadow: "0 0 4px rgba(244,63,94,0.5)",
            animation: `twinkle ${3 + star.delay}s infinite alternate`
          }}
        />
      ))}

      {/* Floating Pastel Helium Balloons */}
      {floatingBalloons.map((ball) => (
        <motion.div
          key={ball.id}
          className="balloon-wrapper"
          style={{ left: `${ball.left}%` }}
          animate={{
            y: "-120vh",
            x: [0, Math.sin(ball.id) * 25, 0],
            rotate: [0, ball.id % 2 === 0 ? 8 : -8, 0]
          }}
          transition={{
            duration: ball.speed,
            repeat: Infinity,
            delay: ball.delay,
            ease: "linear"
          }}
        >
          <div 
            className="balloon" 
            style={{ 
              width: `${ball.size}px`, 
              height: `${ball.size * 1.3}px`, 
              backgroundColor: ball.color, 
              color: ball.color,
              border: "1px solid rgba(255,255,255,0.45)"
            }} 
          />
          <div className="balloon-string" />
        </motion.div>
      ))}

      {/* Golden & Pink Confetti Sparks */}
      {glitterConfetti.map((conf) => (
        <motion.div
          key={conf.id}
          className="absolute rounded-full pointer-events-none z-10"
          style={{
            left: `${conf.left}%`,
            top: "-20px",
            width: `${Math.random() * 5 + 3}px`,
            height: `${Math.random() * 5 + 3}px`,
            backgroundColor: conf.color,
            boxShadow: `0 0 6px ${conf.color}`
          }}
          animate={{
            y: "110vh",
            rotate: 360,
            x: [0, Math.sin(conf.id) * 30, 0]
          }}
          transition={{
            duration: conf.speed,
            repeat: Infinity,
            delay: conf.delay,
            ease: "linear"
          }}
        />
      ))}

      {/* Hidden audio element */}
      <audio 
        ref={audioRef}
        src={AUDIO_SOURCES[currentAudioIndex]}
        preload="auto"
        loop
        onError={() => {
          console.warn(`Audio source ${AUDIO_SOURCES[currentAudioIndex]} failed to load. Trying backup...`);
          if (currentAudioIndex < AUDIO_SOURCES.length - 1) {
            setCurrentAudioIndex(prev => prev + 1);
          }
        }}
      />

      {/* Top Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between z-40 relative">
        <div className="flex items-center gap-3 px-6 py-3 rounded-[32px] bg-white/70 border border-white/80 shadow-clayCard backdrop-blur-xl">
          <Sparkles className="w-4 h-4 text-[#DB2777] animate-spin" style={{ animationDuration: "12s" }} />
          <span className="font-heading tracking-widest text-xs uppercase text-[#332F3A] font-extrabold">
            HAPPY BIRTHDAY IFFAT
          </span>
        </div>

        {scene > 1 && (
          <button
            onClick={() => setMusicPlaying(!musicPlaying)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-[20px] border border-white/80 transition-all duration-300 cursor-pointer shadow-clayButton active:scale-[0.92] active:shadow-clayPressed backdrop-blur-md text-xs font-bold tracking-wider ${
              musicPlaying 
                ? "bg-white/80 text-emerald-700" 
                : "bg-white/80 text-[#DB2777]"
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${musicPlaying ? "bg-emerald-400" : "bg-pink-400"}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${musicPlaying ? "bg-emerald-500" : "bg-pink-500"}`}></span>
            </span>
            {musicPlaying ? <Volume2 className="w-4 h-4 text-emerald-600 animate-bounce" /> : <VolumeX className="w-4 h-4 text-[#DB2777]" />}
            <span className="font-heading text-[11px] uppercase tracking-wider font-extrabold">
              {musicPlaying ? "Music: On" : "Music: Off"}
            </span>
          </button>
        )}
      </header>

      {/* Viewport content */}
      <main className="w-full max-w-4xl mx-auto px-4 md:px-6 py-6 flex-grow flex items-center justify-center z-10 relative">
        <AnimatePresence mode="wait">
          
          {/* Scene 1: Lock Gate */}
          {scene === 1 && (
            <motion.div
              id="scene-1-passcode-gate"
              key="passcode-scene"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-md text-center backdrop-blur-2xl bg-white/70 border border-white/80 rounded-[48px] p-8 md:p-10 shadow-clayDeep flex flex-col items-center relative overflow-hidden"
            >
              <div className="absolute -top-24 w-80 h-80 bg-pink-300/20 blur-[80px] rounded-full pointer-events-none" />

              {/* Padlock Clay Orb */}
              <div className="relative mb-6">
                <motion.div
                  className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#F472B6] to-[#E11D48] shadow-clayButton p-4 text-white"
                  animate={lockStatus === "unlocking" ? { rotateY: 360, scale: 1.1 } : passcodeError ? { x: [-6, 6, -5, 5, 0] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {lockStatus === "locked" ? (
                    <Lock className="w-9 h-9 text-white" />
                  ) : (
                    <Unlock className="w-9 h-9 text-white" />
                  )}
                </motion.div>
              </div>

              <h2 className="font-heading text-3xl md:text-4xl font-black text-[#332F3A] tracking-tight mb-2">
                Iffat's Birthday Portal
              </h2>
              <p className="text-[#635F69] text-sm font-sans mb-8 font-medium">
                Enter secret passcode to unlock
              </p>

              {/* Passcode indicators */}
              <div className="flex items-center gap-4 mb-8">
                {Array.from({ length: 4 }).map((_, idx) => {
                  const filled = idx < enteredPasscode.length;
                  const isLastFilled = idx === enteredPasscode.length - 1;
                  return (
                    <div 
                      key={idx}
                      className="w-6 h-6 rounded-full shadow-clayPressed bg-[#EFEBF5] flex items-center justify-center p-0.5 overflow-hidden"
                    >
                      {filled && (
                        <motion.div 
                          className="w-full h-full bg-gradient-to-r from-[#F472B6] to-[#E11D48] rounded-full shadow-clayButton"
                          initial={isLastFilled ? { scale: 0 } : { scale: 1 }}
                          animate={{ scale: 1 }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Keypad layout */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleKeyPress(num)}
                    className="w-16 h-16 rounded-[20px] bg-[#F4F1FA] active:bg-[#EFEBF5] text-[#332F3A] font-heading font-black text-xl flex items-center justify-center cursor-pointer shadow-clayButton hover:shadow-clayButtonHover active:scale-[0.92] active:shadow-clayPressed transition-all"
                  >
                    {num}
                  </button>
                ))}
                
                <button
                  onClick={handleBackspace}
                  className="w-16 h-16 rounded-[20px] bg-white text-[#635F69] font-heading font-extrabold text-xs flex items-center justify-center cursor-pointer shadow-clayButton hover:shadow-clayButtonHover active:scale-[0.92] active:shadow-clayPressed transition-all"
                >
                  DEL
                </button>

                <button
                  onClick={() => handleKeyPress("0")}
                  className="w-16 h-16 rounded-[20px] bg-[#F4F1FA] active:bg-[#EFEBF5] text-[#332F3A] font-heading font-black text-xl flex items-center justify-center cursor-pointer shadow-clayButton hover:shadow-clayButtonHover active:scale-[0.92] active:shadow-clayPressed transition-all"
                >
                  0
                </button>

                <button
                  onClick={handleClear}
                  className="w-16 h-16 rounded-[20px] bg-white text-[#635F69] font-heading font-extrabold text-xs flex items-center justify-center cursor-pointer shadow-clayButton hover:shadow-clayButtonHover active:scale-[0.92] active:shadow-clayPressed transition-all"
                >
                  CLR
                </button>
              </div>

              <div className="text-xs font-heading tracking-wider uppercase font-bold text-[#635F69]">
                {lockStatus === "unlocking" ? (
                  <span className="text-emerald-600 flex items-center gap-1 animate-pulse font-extrabold">
                    Unlocking Celebration Portal...
                  </span>
                ) : passcodeError ? (
                  <span className="text-rose-600 font-extrabold">Incorrect Passcode! Passcode: 0000</span>
                ) : (
                  <span>Passcode: 0000</span>
                )}
              </div>
            </motion.div>
          )}

          {/* Scene 2: Configuration Switchboard */}
          {scene === 2 && (
            <motion.div
              id="scene-2-mood-toggles"
              key="mood-scene"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -25 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-md backdrop-blur-2xl bg-white/70 border border-white/80 rounded-[48px] p-8 md:p-10 shadow-clayDeep flex flex-col items-center"
            >
              <h2 className="font-heading text-3xl font-black text-[#332F3A] mb-1 tracking-tight text-center">
                Configure Environment
              </h2>
              <p className="text-[#635F69] text-xs font-heading tracking-widest uppercase mb-6 text-center font-extrabold">
                Configure celebration parameters
              </p>

              <div className="w-full space-y-4 mb-6">
                
                {/* Switch 1 */}
                <div className="flex items-center justify-between p-4 rounded-[24px] bg-[#F8F6FC] border border-white/80 shadow-clayCard">
                  <div className="text-left pr-3">
                    <h3 className="font-heading text-sm text-[#332F3A] font-extrabold">
                      Warm Ambient Glow
                    </h3>
                    <p className="text-xs text-[#635F69]">
                      Warms up layout with elegant lighting
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-[#EFEBF5] p-1.5 rounded-full shadow-clayPressed">
                    <button
                      onClick={() => {
                        playSynthSound("click");
                        setAmbientLights(!ambientLights);
                      }}
                      className={`w-14 h-8 rounded-full flex items-center p-1 cursor-pointer transition-all duration-300 relative ${
                        ambientLights 
                          ? "bg-gradient-to-r from-[#F472B6] to-[#E11D48] shadow-clayButton" 
                          : "bg-[#D8D2E2] shadow-inner"
                      }`}
                    >
                      <motion.div 
                        className="w-6 h-6 bg-white rounded-full shadow-clayButton flex items-center justify-center"
                        layout
                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        animate={{ x: ambientLights ? 24 : 0 }}
                      />
                    </button>
                  </div>
                </div>

                {/* Switch 2 */}
                <div className="flex items-center justify-between p-4 rounded-[24px] bg-[#F8F6FC] border border-white/80 shadow-clayCard">
                  <div className="text-left pr-3">
                    <h3 className="font-heading text-sm text-[#332F3A] font-extrabold">
                      Cinematic Music
                    </h3>
                    <p className="text-xs text-[#635F69]">
                      Plays soft audio loops in background
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-[#EFEBF5] p-1.5 rounded-full shadow-clayPressed">
                    <button
                      onClick={() => {
                        playSynthSound("click");
                        setCinematicMusic(!cinematicMusic);
                      }}
                      className={`w-14 h-8 rounded-full flex items-center p-1 cursor-pointer transition-all duration-300 relative ${
                        cinematicMusic 
                          ? "bg-gradient-to-r from-[#F472B6] to-[#E11D48] shadow-clayButton" 
                          : "bg-[#D8D2E2] shadow-inner"
                      }`}
                    >
                      <motion.div 
                        className="w-6 h-6 bg-white rounded-full shadow-clayButton flex items-center justify-center"
                        layout
                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        animate={{ x: cinematicMusic ? 24 : 0 }}
                      />
                    </button>
                  </div>
                </div>

                {/* Switch 3 */}
                <div className="flex items-center justify-between p-4 rounded-[24px] bg-[#F8F6FC] border border-white/80 shadow-clayCard">
                  <div className="text-left pr-3">
                    <h3 className="font-heading text-sm text-[#332F3A] font-extrabold">
                      Helium Balloons & Sparkles
                    </h3>
                    <p className="text-xs text-[#635F69]">
                      Launches decorative colorful items
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-[#EFEBF5] p-1.5 rounded-full shadow-clayPressed">
                    <button
                      onClick={() => {
                        playSynthSound("click");
                        setBalloonsActive(!balloonsActive);
                      }}
                      className={`w-14 h-8 rounded-full flex items-center p-1 cursor-pointer transition-all duration-300 relative ${
                        balloonsActive 
                          ? "bg-gradient-to-r from-[#F472B6] to-[#E11D48] shadow-clayButton" 
                          : "bg-[#D8D2E2] shadow-inner"
                      }`}
                    >
                      <motion.div 
                        className="w-6 h-6 bg-white rounded-full shadow-clayButton flex items-center justify-center"
                        layout
                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        animate={{ x: balloonsActive ? 24 : 0 }}
                      />
                    </button>
                  </div>
                </div>

              </div>

              {/* Soundwaves visualizer */}
              {cinematicMusic && (
                <div className="flex items-end justify-center gap-1.5 h-8 w-full mb-6">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 bg-gradient-to-t from-[#F472B6] to-[#7C3AED] rounded-full"
                      animate={{
                        height: [8, Math.random() * 26 + 6, 8]
                      }}
                      transition={{
                        duration: 0.4 + Math.random() * 0.4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>
              )}

              <button
                onClick={() => {
                  playSynthSound("correct");
                  setScene(3);
                }}
                className="w-full h-14 flex items-center justify-center gap-2 px-6 rounded-[20px] bg-gradient-to-r from-[#A78BFA] to-[#7C3AED] text-white font-heading font-extrabold text-xs tracking-widest uppercase shadow-clayButtonPurple hover:shadow-clayButtonHover active:scale-[0.92] active:shadow-clayPressed transition-all cursor-pointer"
              >
                <span>Initialize Heart Core</span>
                <ChevronRight className="w-4 h-4 text-white animate-pulse" />
              </button>
            </motion.div>
          )}

          {/* Scene 3: Catch Heart Game */}
          {scene === 3 && (
            <motion.div
              id="scene-3-heart-game"
              key="game-scene"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-lg backdrop-blur-2xl bg-white/70 border border-white/80 rounded-[48px] p-8 md:p-10 shadow-clayDeep flex flex-col items-center"
            >
              <h2 className="font-heading text-3xl font-black text-[#332F3A] mb-1 tracking-tight text-center">
                Catch My Heart
              </h2>
              <p className="text-[#635F69] text-xs font-heading tracking-widest uppercase mb-6 text-center font-extrabold">
                Tap the glowing Ruby Heart to charge the portal
              </p>

              {/* Progress bar */}
              <div className="w-full mb-6">
                <div className="flex items-center justify-between text-xs font-heading font-bold text-[#332F3A] mb-2">
                  <span>Progress status:</span>
                  <span className="text-[#DB2777] font-extrabold">{heartsCaught} / 5 HEARTS</span>
                </div>
                <div className="w-full h-5 rounded-full shadow-clayPressed bg-[#EFEBF5] p-1 overflow-hidden">
                  <motion.div 
                    className="h-full rounded-full bg-gradient-to-r from-[#F472B6] to-[#E11D48] shadow-clayButton"
                    initial={{ width: "0%" }}
                    animate={{ width: `${(heartsCaught / 5) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Canvas area */}
              <div 
                ref={gameBoundaryRef}
                className="relative w-full h-80 rounded-[32px] bg-[#F8F6FC] shadow-clayPressed border border-white/60 overflow-hidden flex items-center justify-center cursor-crosshair"
              >
                <motion.div
                  className="absolute p-4 cursor-pointer select-none"
                  style={{
                    left: `${heartPos.x}%`,
                    top: `${heartPos.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 6, -6, 0]
                  }}
                  transition={{
                    scale: { repeat: Infinity, duration: 1.0, ease: "easeInOut" },
                    rotate: { repeat: Infinity, duration: 2.5, ease: "linear" }
                  }}
                  onClick={handleHeartClick}
                >
                  <div className="w-16 h-16 rounded-full bg-white/90 shadow-clayCard hover:scale-110 active:scale-90 transition-all flex items-center justify-center">
                    <HeartIcon className="w-10 h-10 text-[#E11D48] fill-[#E11D48] filter drop-shadow-[0_4px_10px_rgba(225,29,72,0.4)]" />
                  </div>
                </motion.div>

                {/* Sparks on tap */}
                {heartParticles.map((spark) => (
                  <motion.div
                    key={spark.id}
                    className="absolute w-3 h-3 rounded-full"
                    style={{
                      left: spark.x,
                      top: spark.y,
                      backgroundColor: spark.color,
                      boxShadow: `0 0 10px ${spark.color}`
                    }}
                    animate={{
                      x: (Math.random() - 0.5) * 140,
                      y: (Math.random() - 0.5) * 140,
                      scale: 0,
                      opacity: 0
                    }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  />
                ))}

                {/* Completion screen */}
                {heartsCaught >= 5 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 z-10"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="w-16 h-16 rounded-full bg-emerald-100 shadow-clayButton flex items-center justify-center mb-3"
                    >
                      <Check className="w-8 h-8 text-emerald-600" />
                    </motion.div>
                    <h3 className="font-heading text-2xl font-black text-[#332F3A] mb-1">
                      Portal Unlocked!
                    </h3>
                    <p className="text-[#635F69] text-xs px-4 font-sans">
                      The heart core has synchronized successfully.
                    </p>
                  </motion.div>
                )}
              </div>

              <p className="text-xs font-heading tracking-wider text-[#635F69] uppercase mt-4 font-bold">
                Hearts Caught: {heartsCaught} of 5
              </p>
            </motion.div>
          )}

          {/* Scene 4: Holographic Cake */}
          {scene === 4 && (
            <motion.div
              id="scene-4-cake-stage"
              key="cake-scene"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-2xl backdrop-blur-2xl bg-white/70 border border-white/80 rounded-[48px] p-6 md:p-10 shadow-clayDeep flex flex-col items-center"
            >
              <h2 className="font-heading text-3xl md:text-4xl font-black text-[#332F3A] mb-1 tracking-tight text-center">
                Happy Birthday Iffat!
              </h2>
              <p className="text-[#DB2777] text-sm font-sans mb-6 text-center font-bold">
                "Asmaan ke sitaron ke liye ek sunehra tohfa..."
              </p>

              <div className="w-full relative flex flex-col items-center justify-center">
                <InteractiveCake
                  candleExtinguished={cakeExtinguished}
                  onExtinguish={() => {
                    playSynthSound("correct");
                    setCakeExtinguished(true);
                  }}
                />
              </div>

              {/* Proceed to cards */}
              <div className="h-16 mt-6 flex items-center justify-center w-full">
                {cakeExtinguished && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setScene(5)}
                    className="h-14 px-10 rounded-[20px] bg-gradient-to-r from-[#F472B6] to-[#E11D48] text-white font-heading font-extrabold text-xs tracking-widest uppercase shadow-clayButton hover:shadow-clayButtonHover active:scale-[0.92] active:shadow-clayPressed transition-all cursor-pointer flex items-center gap-2"
                  >
                    <span>Open Secret Wish Gallery</span>
                    <ChevronRight className="w-4 h-4 text-white" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}

          {/* Scene 5: Polaroid Gallery with 6 customized images */}
          {scene === 5 && (
            <motion.div
              id="scene-5-wish-gallery"
              key="gallery-scene"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -25 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-5xl backdrop-blur-2xl bg-white/70 border border-white/80 rounded-[48px] p-6 md:p-10 shadow-clayDeep flex flex-col items-center"
            >
              <h2 className="font-heading text-3xl md:text-4xl font-black text-[#332F3A] mb-1 tracking-tight text-center">
                Iffat's Wish Gallery
              </h2>
              <p className="text-[#DB2777] text-xs font-heading tracking-widest uppercase mb-8 text-center font-extrabold">
                Flip the beautiful polaroids to read heartfelt wishes!
              </p>

              {/* Polaroid Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-8">
                {polaroids.map((card) => {
                  const isFlipped = flippedCards.includes(card.id);

                  return (
                    <div 
                      key={card.id}
                      className="w-full h-88 relative cursor-pointer group"
                      style={{ perspective: "1200px" }}
                      onClick={() => handleCardFlip(card.id)}
                    >
                      <motion.div
                        className="w-full h-full relative"
                        style={{ transformStyle: "preserve-3d" }}
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      >
                        
                        {/* FRONT SIDE (Super-rounded Clay Polaroid) */}
                        <div 
                          className="absolute inset-0 w-full h-full bg-white/90 border border-white rounded-[32px] p-4 shadow-clayCard hover:shadow-clayCardHover transition-all flex flex-col justify-between backdrop-blur-md"
                          style={{ 
                            backfaceVisibility: "hidden"
                          }}
                        >
                          <div className="relative w-full h-52 rounded-[24px] overflow-hidden border border-[#EFEBF5] bg-[#F8F6FC]">
                            <img 
                              src={card.imageUrl} 
                              alt={card.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                            {/* Reflection gloss */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
                          </div>

                          <div className="flex items-center justify-between mt-3 px-2">
                            <span className="font-heading text-sm text-[#332F3A] font-extrabold truncate">
                              {card.title}
                            </span>
                            <Eye className="w-4 h-4 text-[#635F69] group-hover:text-[#DB2777] transition-colors" />
                          </div>
                        </div>

                        {/* BACK SIDE (Poetic wish card) */}
                        <div 
                          className="absolute inset-0 w-full h-full bg-[#F8F6FC] border border-white rounded-[32px] p-5 flex flex-col justify-between text-center select-none shadow-clayPressed overflow-y-auto"
                          style={{ 
                            backfaceVisibility: "hidden", 
                            transform: "rotateY(180deg)"
                          }}
                        >
                          <div className="flex-grow flex flex-col justify-between h-full">
                            <div className="flex-grow flex flex-col justify-center space-y-2 py-2">
                              <p className="font-heading italic text-sm text-[#332F3A] leading-relaxed font-bold">
                                "{card.urduWish}"
                              </p>
                              <p className="font-sans text-[#635F69] text-xs leading-relaxed px-1">
                                {card.englishWish}
                              </p>
                            </div>

                            <div className="flex items-center justify-end border-t border-[#EFEBF5] pt-2 mt-1">
                              <span className="text-[10px] font-heading tracking-widest text-[#DB2777] font-extrabold uppercase">
                                Happy Birthday Iffat
                              </span>
                            </div>
                          </div>
                        </div>

                      </motion.div>
                    </div>
                  );
                })}
              </div>

              {/* Status and proceed */}
              <div className="w-full flex flex-col items-center justify-center space-y-4">
                <span className="text-xs font-heading text-[#635F69] font-bold">
                  Cards flipped: {flippedCards.length} of 6
                </span>

                <AnimatePresence>
                  {allCardsFlipped && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={() => {
                        playSynthSound("correct");
                        setScene(6);
                      }}
                      className="h-14 px-10 rounded-[20px] bg-gradient-to-r from-[#A78BFA] to-[#7C3AED] text-white font-heading font-extrabold text-xs tracking-widest uppercase shadow-clayButtonPurple hover:shadow-clayButtonHover active:scale-[0.92] active:shadow-clayPressed transition-all cursor-pointer"
                    >
                      Read Final Letter
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Scene 6: Final Parchment Letter */}
          {scene === 6 && (() => {
            const paragraphs = letterBodyText.split("\n");
            let wordCounter = 0;
            const processedParagraphs = paragraphs.map((p) => {
              if (p.trim() === "") return { isBlank: true, words: [] };
              const words = p.split(/\s+/);
              const wordsWithMeta = words.map((w) => {
                const idx = wordCounter;
                wordCounter++;
                return { text: w, index: idx };
              });
              return { isBlank: false, words: wordsWithMeta };
            });
            const totalWordCount = wordCounter;

            return (
              <motion.div
                id="scene-6-final-letter"
                key="letter-scene"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-2xl backdrop-blur-2xl bg-white/70 border border-white/80 rounded-[48px] p-8 md:p-10 shadow-clayDeep flex flex-col items-center relative overflow-hidden"
              >
                <h2 className="font-heading text-3xl md:text-4xl font-black text-[#332F3A] mb-1 tracking-tight text-center">
                  Letter for Iffat
                </h2>
                <p className="text-[#DB2777] text-xs font-heading tracking-widest uppercase mb-6 text-center font-extrabold">
                  A warm personal blessing note from stardust
                </p>

                {/* Digital Parchment scroll */}
                <div 
                  onClick={() => {
                    if (!showAllWords) {
                      setShowAllWords(true);
                      playSynthSound("sparkle");
                    }
                  }}
                  className="w-full min-h-[300px] rounded-[32px] bg-[#F8F6FC] shadow-clayPressed border border-white/60 p-6 md:p-8 text-[#332F3A] relative overflow-y-auto max-h-96 cursor-pointer select-none"
                >
                  {!showAllWords && (
                    <div className="absolute top-3 right-5 text-[10px] font-heading tracking-wider text-[#DB2777] animate-pulse pointer-events-none font-bold">
                      ⚡ Tap to reveal instantly
                    </div>
                  )}

                  {processedParagraphs.map((para, pIdx) => {
                    if (para.isBlank) {
                      return <div key={`blank-${pIdx}`} className="h-6" />;
                    }
                    return (
                      <p key={`p-${pIdx}`} className="mb-4 flex flex-wrap leading-relaxed text-left">
                        {para.words.map((word) => (
                          <motion.span
                            key={`w-${word.index}`}
                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{
                              delay: showAllWords ? 0 : word.index * 0.08,
                              duration: showAllWords ? 0.2 : 0.45,
                              ease: "easeOut"
                            }}
                            className="inline-block mr-2.5 font-cursive text-2xl md:text-3xl font-medium tracking-wide text-[#332F3A] hover:text-[#DB2777] hover:scale-105 transition-all duration-300 select-text"
                          >
                            {word.text}
                          </motion.span>
                        ))}
                      </p>
                    );
                  })}

                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: showAllWords ? 0.25 : totalWordCount * 0.08 + 0.3,
                      duration: 0.8 
                    }}
                    className="mt-6 pt-5 border-t border-[#EFEBF5] flex flex-col items-end"
                  >
                    <span className="text-xs font-heading tracking-widest uppercase text-[#DB2777] font-extrabold mb-1">
                      From Your Lover
                    </span>
                    <span 
                      className="font-cursive text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E11D48] via-[#DB2777] to-[#7C3AED]"
                      style={{
                        filter: "drop-shadow(0 0 8px rgba(225,29,72,0.3))"
                      }}
                    >
                      Haseeb
                    </span>
                  </motion.div>
                </div>

                <button
                  onClick={handleResetApp}
                  className="mt-6 flex items-center gap-2 h-14 px-8 rounded-[20px] bg-white text-[#332F3A] font-heading font-extrabold text-xs tracking-widest uppercase shadow-clayButton hover:shadow-clayButtonHover active:scale-[0.92] active:shadow-clayPressed transition-all cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-[#DB2777] animate-spin" style={{ animationDuration: "5s" }} />
                  <span>Replay Portal</span>
                </button>
              </motion.div>
            );
          })()}

        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between text-[#635F69] text-xs font-heading font-bold z-40 relative border-t border-white/60">
        <span className="font-extrabold text-[#DB2777]">From Your Lover Haseeb</span>
        <span className="mt-1 md:mt-0">MADE WITH ETERNAL GRACE • 2026</span>
      </footer>

    </div>
  );
}
