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
function TelegramIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z"/>
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

function VideoReel({
  reel,
  isActive,
  isMuted,
  toggleRef,
}: {
  reel: Reel;
  isActive: boolean;
  isMuted: boolean;
  toggleRef: React.MutableRefObject<(() => void) | null>;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  // Keep toggleRef up to date so parent can call it on tap
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
      // Always start muted to satisfy autoplay policy, then unmute if needed
      video.muted = true;
      const tryPlay = () => {
        setIsLoading(false);
        video.play()
          .then(() => {
            setIsPlaying(true);
            video.muted = isMuted;
          })
          .catch(() => setIsPlaying(false));
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
      setIsPlaying(false);
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

      {/* Loading spinner */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center z-[6] pointer-events-none">
          <div className="w-12 h-12 rounded-full border-2 border-white/20 border-t-white animate-spin" />
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-[6] pointer-events-none gap-2">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" opacity="0.5">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span className="text-white/50 text-sm">Видео недоступно</span>
        </div>
      )}

      {/* Pause indicator — no pointer events, parent handles tap */}
      {!isPlaying && !isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center z-[6] pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </div>
        </div>
      )}

      {/* Progress bar */}
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

  const goNext = useCallback(() => {
    if (currentIndex < REELS.length - 1) {
      setDirection("up");
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection("down");
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex]);

  // Unified gesture start
  const gestureStart = useCallback((clientY: number) => {
    startY.current = clientY;
    dragYRef.current = 0;
    setIsDragging(true);
    setDragY(0);
  }, []);

  // Unified gesture move
  const gestureMove = useCallback((clientY: number) => {
    if (startY.current === null) return;
    const dy = clientY - startY.current;
    dragYRef.current = dy;
    setDragY(dy);
  }, []);

  // Unified gesture end
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

  // Touch handlers (mobile)
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    gestureStart(e.touches[0].clientY);
  }, [gestureStart]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    gestureMove(e.touches[0].clientY);
  }, [gestureMove]);

  const onTouchEnd = useCallback(() => {
    gestureEnd();
  }, [gestureEnd]);

  // Mouse handlers (desktop preview)
  const isMouseDown = useRef(false);
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isMouseDown.current = true;
    gestureStart(e.clientY);
  }, [gestureStart]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isMouseDown.current) return;
    gestureMove(e.clientY);
  }, [gestureMove]);

  const onMouseUp = useCallback(() => {
    if (!isMouseDown.current) return;
    isMouseDown.current = false;
    gestureEnd();
  }, [gestureEnd]);

  const toggleLike = (id: number) => {
    setLikedReels((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // Stop swipe from firing on interactive elements
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
      className="relative w-full h-full overflow-hidden bg-black select-none"
      style={{ touchAction: "none" }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
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
              <div className="w-11 h-11 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
                <HeartIcon filled={isLiked} />
              </div>
              <span className="text-white text-xs font-semibold drop-shadow">
                {reel.likes + (isLiked ? 1 : 0)}
              </span>
            </button>
            <button className="flex flex-col items-center gap-1" {...stopSwipe}>
              <div className="w-11 h-11 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
                <CommentIcon />
              </div>
              <span className="text-white text-xs font-semibold drop-shadow">{reel.comments}</span>
            </button>
            <button className="flex flex-col items-center gap-1" {...stopSwipe}>
              <div className="w-11 h-11 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
                <ShareIcon />
              </div>
              <span className="text-white text-xs font-semibold drop-shadow">{reel.shares}</span>
            </button>
            <button className="flex flex-col items-center gap-1" {...stopSwipe}>
              <div className="w-11 h-11 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
                <TelegramIcon />
              </div>
              <span className="text-white text-xs font-semibold drop-shadow">{reel.reposts}</span>
            </button>
            <button className="flex flex-col items-center gap-1" {...stopSwipe}>
              <div className="w-11 h-11 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
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
              <div className="w-9 h-9 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
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

      {/* Drag arrow hint */}
      {isDragging && Math.abs(dragY) > 20 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
          <div className="text-white/30 text-3xl">{dragY < 0 ? "↑" : "↓"}</div>
        </div>
      )}
    </div>
  );
}
