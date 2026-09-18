"use client";

import { useRef, useState, useEffect, useCallback } from "react";

interface AudioPlayerProps {
  audioUrl: string | null;
  onDownload?: () => void;
  isLoading?: boolean;
}

export default function AudioPlayer({
  audioUrl,
  onDownload,
  isLoading = false,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Setup audio context and analyser for visualization
  const setupAudioContext = useCallback(() => {
    if (!audioRef.current || audioContextRef.current) return;

    try {
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;

      const source = ctx.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(ctx.destination);

      audioContextRef.current = ctx;
      analyserRef.current = analyser;
      sourceRef.current = source;
    } catch {
      // Audio context may already exist
    }
  }, []);

  // Draw waveform visualization
  const drawVisualization = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      animFrameRef.current = requestAnimationFrame(draw);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      const barCount = 64;
      const barWidth = width / barCount - 2;
      const barGap = 2;

      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor((i / barCount) * bufferLength);
        const value = dataArray[dataIndex] / 255;
        const barHeight = Math.max(2, value * height * 0.8);

        const x = i * (barWidth + barGap);
        const y = (height - barHeight) / 2;

        // Gradient from purple to cyan
        const ratio = i / barCount;
        const r = Math.floor(139 * (1 - ratio) + 6 * ratio);
        const g = Math.floor(92 * (1 - ratio) + 182 * ratio);
        const b = Math.floor(246 * (1 - ratio) + 212 * ratio);

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.4 + value * 0.6})`;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }
    };

    draw();
  }, []);

  // Stop visualization
  const stopVisualization = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Draw idle bars
        const width = canvas.width;
        const height = canvas.height;
        ctx.clearRect(0, 0, width, height);
        const barCount = 64;
        const barWidth = width / barCount - 2;
        const barGap = 2;
        for (let i = 0; i < barCount; i++) {
          const x = i * (barWidth + barGap);
          const barHeight = 2 + Math.sin(i * 0.3) * 2;
          const y = (height - barHeight) / 2;
          ctx.fillStyle = "rgba(139, 92, 246, 0.15)";
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, 1);
          ctx.fill();
        }
      }
    }
  }, []);

  useEffect(() => {
    stopVisualization();
  }, [stopVisualization]);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      if (!isDragging) {
        setCurrentTime(audio.currentTime);
      }
    };
    const onLoadedMetadata = () => {
      setDuration(audio.duration);
      setCurrentTime(0);
    };
    const onEnded = () => {
      setIsPlaying(false);
      stopVisualization();
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, [isDragging, stopVisualization]);

  // Reset state when audio URL changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    stopVisualization();
  }, [audioUrl, stopVisualization]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    setupAudioContext();

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      stopVisualization();
    } else {
      if (audioContextRef.current?.state === "suspended") {
        await audioContextRef.current.resume();
      }
      await audio.play();
      setIsPlaying(true);
      drawVisualization();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (seconds: number): string => {
    if (!isFinite(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const hasAudio = !!audioUrl;

  return (
    <div className="animate-fade-in-d4">
      <label
        style={{
          display: "block",
          fontSize: "13px",
          fontWeight: 600,
          color: "var(--text-secondary)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: "10px",
        }}
      >
        Audio Player
      </label>

      <div
        className="glass-card"
        style={{
          padding: "20px",
          borderRadius: "var(--radius-md)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Hidden audio element */}
        {audioUrl && <audio ref={audioRef} src={audioUrl} preload="metadata" />}

        {/* Waveform Visualization */}
        <div
          style={{
            height: "60px",
            marginBottom: "16px",
            borderRadius: "var(--radius-sm)",
            background: "rgba(255,255,255,0.02)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {isLoading ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                color: "var(--text-tertiary)",
                fontSize: "13px",
              }}
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  border: "2px solid var(--border-subtle)",
                  borderTopColor: "var(--accent-purple)",
                  borderRadius: "50%",
                  animation: "spin-slow 0.8s linear infinite",
                }}
              />
              Generating audio...
            </div>
          ) : !hasAudio ? (
            <div
              style={{
                color: "var(--text-muted)",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
              Generate speech to see waveform
            </div>
          ) : (
            <canvas
              ref={canvasRef}
              width={600}
              height={60}
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          )}
        </div>

        {/* Controls Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          {/* Play/Pause button */}
          <button
            id="audio-play-btn"
            onClick={togglePlay}
            disabled={!hasAudio || isLoading}
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              border: "none",
              background: hasAudio
                ? "linear-gradient(135deg, var(--accent-purple), var(--accent-purple-hover))"
                : "rgba(255,255,255,0.06)",
              color: hasAudio ? "white" : "var(--text-muted)",
              cursor: hasAudio ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "all var(--transition-fast)",
              boxShadow: hasAudio ? "var(--shadow-glow)" : "none",
            }}
            onMouseEnter={(e) => {
              if (hasAudio) {
                e.currentTarget.style.transform = "scale(1.08)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {isPlaying ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ marginLeft: "2px" }}
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Time + Progress */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                position: "relative",
                height: "4px",
                background: "rgba(255,255,255,0.06)",
                borderRadius: "2px",
                cursor: hasAudio ? "pointer" : "default",
              }}
            >
              {/* Progress fill */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: "100%",
                  width: `${progress}%`,
                  borderRadius: "2px",
                  background:
                    "linear-gradient(90deg, var(--accent-purple), var(--accent-cyan))",
                  transition: isDragging ? "none" : "width 0.1s linear",
                }}
              />
              {hasAudio && (
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  step={0.1}
                  value={currentTime}
                  onChange={handleSeek}
                  onMouseDown={() => setIsDragging(true)}
                  onMouseUp={() => setIsDragging(false)}
                  style={{
                    position: "absolute",
                    top: "-6px",
                    left: 0,
                    width: "100%",
                    height: "16px",
                    opacity: 0,
                    cursor: "pointer",
                    zIndex: 2,
                  }}
                />
              )}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "6px",
                fontSize: "11px",
                color: "var(--text-muted)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Download button */}
          <button
            id="audio-download-btn"
            onClick={onDownload}
            disabled={!hasAudio || isLoading}
            style={{
              padding: "10px 18px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-subtle)",
              background: hasAudio
                ? "rgba(255,255,255,0.04)"
                : "transparent",
              color: hasAudio ? "var(--text-secondary)" : "var(--text-muted)",
              cursor: hasAudio ? "pointer" : "not-allowed",
              fontSize: "12px",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: "'Inter', sans-serif",
              transition: "all var(--transition-fast)",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              if (hasAudio) {
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                e.currentTarget.style.borderColor = "var(--border-medium)";
              }
            }}
            onMouseLeave={(e) => {
              if (hasAudio) {
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.borderColor = "var(--border-subtle)";
              }
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            MP3
          </button>
        </div>

        {/* Animated orb when playing */}
        {isPlaying && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "var(--accent-green)",
              animation: "orb-breathe 1.5s ease-in-out infinite",
              boxShadow: "0 0 8px rgba(16, 185, 129, 0.5)",
            }}
          />
        )}
      </div>
    </div>
  );
}
