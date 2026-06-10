import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Reel {
  id: number;
  videoUrl: string;
  username: string;
  category: string;
  description: string;
  likes: number;
  comments: number;
  shares: number;
  reposts: number;
  avatarColor: string;
}

interface CoinParticle {
  id: number;
  value: number;
  offsetX: number;
}

const BASE = import.meta.env.BASE_URL;

const REELS: Reel[] = [
  {
    id: 1,
    videoUrl: `${BASE}videos/v1.mp4`,
    username: "Нежный Travel 🌎",
    category: "Путешествия",
    description: "Огонь и природа 🔥",
    likes: 5,
    comments: 3,
    shares: 0,
    reposts: 75,
    avatarColor: "#e85d4a",
  },
  {
    id: 2,
    videoUrl: `${BASE}videos/v4.mp4`,
    username: "Леонардо Дайвинчик",
    category: "Юмор и мемы",
    description: "Мы? 😂",
    likes: 7,
    comments: 0,
    shares: 0,
    reposts: 75,
    avatarColor: "#4a90e8",
  },
  {
    id: 3,
    videoUrl: `${BASE}videos/v5.mp4`,
    username: "Александр Зубарев",
    category: "Юмор и мемы",
    description: "Веселись по-крупному 🎉",
    likes: 1,
    comments: 0,
    shares: 0,
    reposts: 75,
    avatarColor: "#7c5cbf",
  },
  {
    id: 4,
    videoUrl: `${BASE}videos/v3.mp4`,
    username: "Нежный Travel 🌎",
    category: "Авто",
    description: "Дорога зовёт 🚗",
    likes: 12,
    comments: 4,
    shares: 2,
    reposts: 75,
    avatarColor: "#e85d4a",
  },
  {
    id: 5,
    videoUrl: `${BASE}videos/v2.mp4`,
    username: "magerya",
    category: "Здоровье и медицина",
    description: "Сегодня съёмки на Первом 🎬",
    likes: 7,
    comments: 1,
    shares: 0,
    reposts: 75,
    avatarColor: "#2ecc71",
  },
];

const SWIPE_THRESHOLD = 80;
const TAP_THRESHOLD = 8;
const FILL_DURATION = 20; // seconds to fill logo 100%
const COIN_SCHEDULE = [1, 3, 7, 12, 18]; // seconds at which coins spawn

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill={filled ? "#fe2c55" : "none"} stroke={filled ? "#fe2c55" : "white"} strokeWidth="1.8">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}
function CommentIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}
function ShareIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  );
}
function BookmarkIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
    </svg>
  );
}
function ExpandIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
      <polyline points="15 3 21 3 21 9"/>
      <polyline points="9 21 3 21 3 15"/>
      <line x1="21" y1="3" x2="14" y2="10"/>
      <line x1="3" y1="21" x2="10" y2="14"/>
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  );
}
function MoreIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}
function ChevronDownIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}
function MuteIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0 0 17.73 18l1.73 1.73L21 18.46 5.54 3 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
    </svg>
  );
}
function SoundIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
    </svg>
  );
}

function TrndLogoFill({ progress }: { progress: number }) {
  const pct = Math.min(Math.max(progress, 0), 1);
  const clipTop = (1 - pct) * 100;
  return (
    <div className="relative" style={{ width: 28, height: 28 }}>
      <img
        src="/logo_trends.png"
        width={28}
        height={28}
        style={{ objectFit: "contain", filter: "brightness(0.3) contrast(1.2)", display: "block" }}
        alt=""
      />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          clipPath: `inset(${clipTop}% 0 0 0)`,
          transition: "clip-path 0.25s linear",
        }}
      >
        <img
          src="/logo_trends.png"
          width={28}
          height={28}
          style={{
            objectFit: "contain",
            filter: "brightness(0.85) sepia(1) hue-rotate(175deg) saturate(18) contrast(1.4)",
            display: "block",
          }}
          alt=""
        />
      </div>
    </div>
  );
}

function CoinParticleItem({ value, offsetX, onDone }: { value: number; offsetX: number; onDone: () => void }) {
  return (
    <motion.div
      className="absolute pointer-events-none flex items-center gap-1 z-50"
      style={{ bottom: 0, right: offsetX }}
      initial={{ opacity: 0, y: 0, scale: 0.6 }}
      animate={{ opacity: [0, 1, 1, 0], y: -90, scale: [0.6, 1.1, 1, 0.85] }}
      transition={{ duration: 1.4, ease: "easeOut", times: [0, 0.15, 0.7, 1] }}
      onAnimationComplete={onDone}
    >
      <div
        className="flex items-center gap-1 rounded-full px-2 py-0.5"
        style={{
          background: "rgba(0,0,0,0.55)",
          border: "1px solid rgba(56,189,248,0.6)",
          backdropFilter: "blur(6px)",
        }}
      >
        <img src="/logo_trends.png" width={12} height={12} style={{ filter: "brightness(0.85) sepia(1) hue-rotate(175deg) saturate(18)", objectFit: "contain" }} alt="" />
        <span style={{ color: "#38bdf8", fontSize: 11, fontWeight: 700, letterSpacing: "0.03em" }}>
          +{value}TRND
        </span>
      </div>
    </motion.div>
  );
}

function SwipeEarnAnim({ amount, onDone }: { amount: number; onDone: () => void }) {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-[60]"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: 1.8, times: [0, 0.1, 0.7, 1] }}
      onAnimationComplete={onDone}
    >
      <motion.div
        className="flex flex-col items-center gap-2"
        initial={{ scale: 0.4, y: 30 }}
        animate={{ scale: [0.4, 1.15, 1], y: [30, -10, 0] }}
        transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <div
          className="flex items-center gap-3 rounded-2xl px-6 py-3"
          style={{
            background: "rgba(0,0,0,0.72)",
            border: "1.5px solid rgba(56,189,248,0.7)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 0 32px rgba(56,189,248,0.35), 0 0 8px rgba(56,189,248,0.2)",
          }}
        >
          <img
            src="/logo_trends.png"
            width={32}
            height={32}
            style={{ filter: "brightness(0.9) sepia(1) hue-rotate(175deg) saturate(18) contrast(1.3)", objectFit: "contain" }}
            alt=""
          />
          <div className="flex flex-col">
            <span style={{ color: "#38bdf8", fontSize: 22, fontWeight: 800, letterSpacing: "0.04em", lineHeight: 1 }}>
              +{amount} TRND
            </span>
            <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 11, marginTop: 2 }}>начислено за просмотр</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function VideoReel({
  reel,
  isActive,
  isMuted,
  toggleRef,
  onPlayChange,
}: {
  reel: Reel;
  isActive: boolean;
  isMuted: boolean;
  toggleRef: React.MutableRefObject<(() => void) | null>;
  onPlayChange?: (playing: boolean) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const setPlay = useCallback((v: boolean) => {
    setIsPlaying(v);
    onPlayChange?.(v);
  }, [onPlayChange]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setPlay(true)).catch(() => {});
    } else {
      video.pause();
      setPlay(false);
    }
  }, [setPlay]);

  useEffect(() => {
    toggleRef.current = togglePlay;
  }, [togglePlay, toggleRef]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.currentTime = 0;
      setIsLoading(true);
      setHasError(false);
      video.muted = true;
      const tryPlay = () => {
        setIsLoading(false);
        video.play()
          .then(() => {
            setPlay(true);
            video.muted = isMuted;
          })
          .catch(() => setPlay(false));
      };
      if (video.readyState >= 3) {
        tryPlay();
      } else {
        video.addEventListener("canplay", tryPlay, { once: true });
        return () => video.removeEventListener("canplay", tryPlay);
      }
    } else {
      video.pause();
      video.currentTime = 0;
      setProgress(0);
      setPlay(false);
      setIsLoading(true);
    }
  }, [isActive]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onTimeUpdate = () => {
      if (video.duration) setProgress(video.currentTime / video.duration);
    };
    const onLoadedMetadata = () => setDuration(video.duration);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, []);

  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;

  return (
    <>
      <video
        ref={videoRef}
        src={reel.videoUrl}
        className="absolute inset-0 w-full h-full object-cover"
        loop
        muted
        playsInline
        preload="auto"
        onError={() => { setHasError(true); setIsLoading(false); }}
        onLoadedData={() => setIsLoading(false)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center z-[6] pointer-events-none">
          <div className="w-12 h-12 rounded-full border-2 border-white/20 border-t-white animate-spin" />
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-[6] pointer-events-none gap-2">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" opacity="0.5">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span className="text-white/50 text-sm">Видео недоступно</span>
        </div>
      )}

      {!isPlaying && !isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center z-[6] pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </div>
        </div>
      )}

      <div
        className="absolute left-4 right-4 z-10 flex items-center gap-2 pointer-events-none"
        style={{ bottom: "calc(76px + env(safe-area-inset-bottom, 0px))" }}
      >
        <span className="text-white/70 text-xs tabular-nums">{fmt(progress * duration)}</span>
        <div className="flex-1 h-[3px] bg-white/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-[width] duration-100"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <div className="flex items-center gap-2 pointer-events-auto">
          <button className="p-1" onPointerDown={(e) => e.stopPropagation()}>
            <BookmarkIcon />
          </button>
          <button className="p-1" onPointerDown={(e) => e.stopPropagation()}>
            <ExpandIcon />
          </button>
        </div>
        <span className="text-white/70 text-xs tabular-nums">{duration ? fmt(duration) : "0:00"}</span>
      </div>
    </>
  );
}

export default function ReelsFeed() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedReels, setLikedReels] = useState<Set<number>>(new Set());
  const [direction, setDirection] = useState<"up" | "down">("up");
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const startY = useRef<number | null>(null);
  const dragYRef = useRef(0);
  const videoToggleRef = useRef<(() => void) | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const watchTimeRef = useRef(0);
  const [fillProgress, setFillProgress] = useState(0);
  const [coins, setCoins] = useState<CoinParticle[]>([]);
  const coinIdRef = useRef(0);
  const spawnedTimesRef = useRef<Set<number>>(new Set());
  const [earnAnim, setEarnAnim] = useState<{ id: number; amount: number } | null>(null);

  useEffect(() => {
    watchTimeRef.current = 0;
    setFillProgress(0);
    setIsPlaying(false);
    setCoins([]);
    spawnedTimesRef.current = new Set();
  }, [currentIndex]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      watchTimeRef.current += 0.1;
      const wt = watchTimeRef.current;
      setFillProgress(Math.min(wt / FILL_DURATION, 1));

      COIN_SCHEDULE.forEach((t) => {
        if (!spawnedTimesRef.current.has(t) && wt >= t) {
          spawnedTimesRef.current.add(t);
          const values = [1, 3, 5];
          const value = values[Math.floor(Math.random() * values.length)];
          const offsetX = Math.random() * 20 - 10;
          const id = ++coinIdRef.current;
          setCoins((prev) => [...prev, { id, value, offsetX }]);
        }
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const triggerEarnIfWatched = useCallback(() => {
    if (watchTimeRef.current >= 1) {
      const id = Date.now();
      setEarnAnim({ id, amount: 1 });
    }
  }, []);

  const goNext = useCallback(() => {
    if (currentIndex < REELS.length - 1) {
      triggerEarnIfWatched();
      setDirection("up");
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, triggerEarnIfWatched]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      triggerEarnIfWatched();
      setDirection("down");
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex, triggerEarnIfWatched]);

  const wheelAccum = useRef(0);
  const wheelCooldown = useRef(false);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (wheelCooldown.current) return;
      wheelAccum.current += e.deltaY;
      if (wheelAccum.current > 60) {
        wheelAccum.current = 0;
        wheelCooldown.current = true;
        setTimeout(() => { wheelCooldown.current = false; }, 600);
        triggerEarnIfWatched();
        setDirection("up");
        setCurrentIndex((i) => Math.min(i + 1, REELS.length - 1));
      } else if (wheelAccum.current < -60) {
        wheelAccum.current = 0;
        wheelCooldown.current = true;
        setTimeout(() => { wheelCooldown.current = false; }, 600);
        triggerEarnIfWatched();
        setDirection("down");
        setCurrentIndex((i) => Math.max(i - 1, 0));
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [triggerEarnIfWatched]);

  const gestureStart = useCallback((clientY: number) => {
    startY.current = clientY;
    dragYRef.current = 0;
    setIsDragging(true);
    setDragY(0);
  }, []);

  const gestureMove = useCallback((clientY: number) => {
    if (startY.current === null) return;
    const dy = clientY - startY.current;
    dragYRef.current = dy;
    setDragY(dy);
  }, []);

  const gestureEnd = useCallback(() => {
    if (startY.current === null) return;
    const dy = dragYRef.current;
    startY.current = null;
    dragYRef.current = 0;
    setIsDragging(false);
    setDragY(0);

    if (Math.abs(dy) < TAP_THRESHOLD) {
      videoToggleRef.current?.();
    } else if (dy < -SWIPE_THRESHOLD) {
      goNext();
    } else if (dy > SWIPE_THRESHOLD) {
      goPrev();
    }
  }, [goNext, goPrev]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    gestureStart(e.touches[0].clientY);
  }, [gestureStart]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    gestureMove(e.touches[0].clientY);
  }, [gestureMove]);

  const onTouchEnd = useCallback(() => {
    gestureEnd();
  }, [gestureEnd]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    gestureStart(e.clientY);
    const handleMove = (ev: MouseEvent) => gestureMove(ev.clientY);
    const handleUp = () => {
      gestureEnd();
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  }, [gestureStart, gestureMove, gestureEnd]);

  const toggleLike = (id: number) => {
    setLikedReels((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const stopSwipe = {
    onTouchStart: (e: React.TouchEvent) => e.stopPropagation(),
    onMouseDown: (e: React.MouseEvent) => e.stopPropagation(),
  };

  const variants = {
    enter: (dir: "up" | "down") => ({ y: dir === "up" ? "100%" : "-100%", opacity: 0 }),
    center: { y: 0, opacity: 1 },
    exit: (dir: "up" | "down") => ({ y: dir === "up" ? "-100%" : "100%", opacity: 0 }),
  };

  const reel = REELS[currentIndex];
  const isLiked = likedReels.has(reel.id);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-black select-none"
      style={{ touchAction: "none" }}
    >
      <AnimatePresence custom={direction} initial={false}>
        <motion.div
          key={reel.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 380, damping: 38, mass: 0.8 }}
          className="absolute inset-0 flex flex-col"
          style={{ y: isDragging ? dragY * 0.3 : 0 }}
        >
          <VideoReel
            reel={reel}
            isActive={true}
            isMuted={isMuted}
            toggleRef={videoToggleRef}
            onPlayChange={setIsPlaying}
          />

          <div
            className="absolute inset-0 z-[3]"
            style={{ cursor: isDragging ? "grabbing" : "grab" }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onMouseDown={onMouseDown}
          />

          {/* Top bar */}
          <div
            className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 pb-2"
            style={{ paddingTop: "calc(12px + env(safe-area-inset-top, 0px))" }}
          >
            <button className="flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1.5" {...stopSwipe}>
              <CloseIcon />
              <span className="text-white text-sm font-medium">Закрыть</span>
            </button>
            <div className="flex items-center gap-3">
              <button
                className="bg-black/20 backdrop-blur-sm rounded-full p-2"
                {...stopSwipe}
                onClick={() => setIsMuted((m) => !m)}
              >
                {isMuted ? <MuteIcon /> : <SoundIcon />}
              </button>
              <button className="bg-black/20 backdrop-blur-sm rounded-full p-1.5" {...stopSwipe}>
                <ChevronDownIcon />
              </button>
              <button className="bg-black/20 backdrop-blur-sm rounded-full p-1.5" {...stopSwipe}>
                <MoreIcon />
              </button>
            </div>
          </div>

          {/* Right action buttons */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-4">
            <button
              className="flex flex-col items-center gap-1"
              {...stopSwipe}
              onClick={() => toggleLike(reel.id)}
            >
              <div className="w-11 h-11 flex items-center justify-center">
                <HeartIcon filled={isLiked} />
              </div>
              <span className="text-white text-xs font-semibold drop-shadow">
                {reel.likes + (isLiked ? 1 : 0)}
              </span>
            </button>
            <button className="flex flex-col items-center gap-1" {...stopSwipe}>
              <div className="w-11 h-11 flex items-center justify-center">
                <CommentIcon />
              </div>
              <span className="text-white text-xs font-semibold drop-shadow">{reel.comments}</span>
            </button>
            <button className="flex flex-col items-center gap-1" {...stopSwipe}>
              <div className="w-11 h-11 flex items-center justify-center">
                <ShareIcon />
              </div>
              <span className="text-white text-xs font-semibold drop-shadow">{reel.shares}</span>
            </button>

            {/* TRND logo with fill + coin particles */}
            <div className="flex flex-col items-center gap-1 relative" {...stopSwipe}>
              <div className="w-11 h-11 flex items-center justify-center relative">
                <TrndLogoFill progress={fillProgress} />

                {/* Coin particles fly up from this spot */}
                <AnimatePresence>
                  {coins.map((coin) => (
                    <CoinParticleItem
                      key={coin.id}
                      value={coin.value}
                      offsetX={coin.offsetX}
                      onDone={() => setCoins((prev) => prev.filter((c) => c.id !== coin.id))}
                    />
                  ))}
                </AnimatePresence>
              </div>
              <span className="text-white text-xs font-semibold drop-shadow">{reel.reposts}</span>
            </div>

            <button className="flex flex-col items-center gap-1" {...stopSwipe}>
              <div className="w-11 h-11 flex items-center justify-center">
                <MenuIcon />
              </div>
            </button>
            <button className="flex flex-col items-center gap-1" {...stopSwipe}>
              <div
                className="w-11 h-11 rounded-full border-2 border-white overflow-hidden flex items-center justify-center text-white font-bold text-sm"
                style={{ background: reel.avatarColor }}
              >
                {reel.username.charAt(0).toUpperCase()}
              </div>
            </button>
            <button className="flex flex-col items-center gap-1" {...stopSwipe}>
              <div className="w-9 h-9 flex items-center justify-center">
                <MoreIcon />
              </div>
            </button>
          </div>

          {/* Bottom author bar */}
          <div
            className="absolute bottom-0 left-0 right-0 z-10 px-4"
            style={{ paddingBottom: "calc(16px + env(safe-area-inset-bottom, 0px))" }}
          >
            {reel.description && (
              <p className="text-white text-sm font-medium mb-2 drop-shadow max-w-[75%] leading-snug">
                {reel.description}
              </p>
            )}
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-9 h-9 rounded-full border border-white/60 flex items-center justify-center text-white font-bold text-sm shrink-0"
                  style={{ background: reel.avatarColor }}
                >
                  {reel.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold leading-tight drop-shadow">{reel.username}</p>
                  <p className="text-white/60 text-xs leading-tight">Для вас · {reel.category}</p>
                </div>
              </div>
              <button
                className="flex items-center gap-1.5 bg-transparent border border-white/70 text-white text-sm font-medium rounded-full px-4 py-1.5 hover:bg-white/10 transition-colors"
                {...stopSwipe}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
                Подписаться
              </button>
            </div>
          </div>

          {/* Swipe earn animation */}
          <AnimatePresence>
            {earnAnim && (
              <SwipeEarnAnim
                key={earnAnim.id}
                amount={earnAnim.amount}
                onDone={() => setEarnAnim(null)}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Scroll position dots */}
      <div className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-1 pointer-events-none">
        {REELS.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width: 3,
              height: i === currentIndex ? 18 : 5,
              background: i === currentIndex ? "white" : "rgba(255,255,255,0.35)",
            }}
          />
        ))}
      </div>

      {isDragging && Math.abs(dragY) > 20 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
          <div className="text-white/30 text-3xl">{dragY < 0 ? "↑" : "↓"}</div>
        </div>
      )}
    </div>
  );
}
