"use client";

import { useState, useCallback } from "react";
import TextInput from "@/components/TextInput";
import VoiceSelector from "@/components/VoiceSelector";
import VoiceSettings from "@/components/VoiceSettings";
import AudioPlayer from "@/components/AudioPlayer";
import GenerateButton from "@/components/GenerateButton";
import { TTSSettings, generateSpeech, downloadAudio } from "@/lib/api";

export default function Home() {
  const [text, setText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("en-US-EmmaNeural");
  const [settings, setSettings] = useState<TTSSettings>({
    rate: 0,
    pitch: 0,
    volume: 0,
  });
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canGenerate = text.trim().length > 0 && selectedVoice;

  const handleGenerate = useCallback(async () => {
    if (!canGenerate || isLoading) return;

    setIsLoading(true);
    setError(null);

    // Revoke previous audio URL to free memory
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }

    try {
      const blob = await generateSpeech(text, selectedVoice, settings);
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to generate speech";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [text, selectedVoice, settings, canGenerate, isLoading, audioUrl]);

  const handleDownload = useCallback(async () => {
    try {
      await downloadAudio(text, selectedVoice, settings);
    } catch (err) {
      setError("Download failed. Please try again.");
    }
  }, [text, selectedVoice, settings]);

  return (
    <div
      style={{
        position: "relative",
        zIndex: 1,
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Header ──────────────────────────────── */}
      <header
        style={{
          padding: "20px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border-subtle)",
          backdropFilter: "blur(20px)",
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(8, 8, 13, 0.8)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          {/* Logo */}
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "var(--radius-sm)",
              background:
                "linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 16px rgba(139, 92, 246, 0.3)",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
          </div>
          <div>
            <h1
              style={{
                fontSize: "20px",
                fontWeight: 700,
                background:
                  "linear-gradient(135deg, var(--text-primary), var(--accent-purple))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: 1.2,
              }}
            >
              VoiceCraft
            </h1>
            <p
              style={{
                fontSize: "11px",
                color: "var(--text-muted)",
                lineHeight: 1.2,
              }}
            >
              AI Voice Generator
            </p>
          </div>
        </div>

        {/* Header right */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "var(--radius-pill)",
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--accent-green)",
                boxShadow: "0 0 6px rgba(16, 185, 129, 0.5)",
              }}
            />
            <span
              style={{
                fontSize: "11px",
                color: "var(--accent-green)",
                fontWeight: 500,
              }}
            >
              400+ Neural Voices
            </span>
          </div>
        </div>
      </header>

      {/* ── Main Content ────────────────────────── */}
      <main
        style={{
          flex: 1,
          maxWidth: "1200px",
          width: "100%",
          margin: "0 auto",
          padding: "32px 24px 48px",
        }}
      >
        {/* Hero text */}
        <div
          className="animate-fade-in-up"
          style={{
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(24px, 4vw, 36px)",
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: "12px",
              background:
                "linear-gradient(135deg, var(--text-primary) 0%, var(--accent-purple) 50%, var(--accent-cyan) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Transform Text into Natural Speech
          </h2>
          <p
            style={{
              fontSize: "15px",
              color: "var(--text-tertiary)",
              maxWidth: "500px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Premium AI voices in 50+ languages. Free, fast, and incredibly
            natural sounding.
          </p>
        </div>

        {/* Text Input */}
        <TextInput value={text} onChange={setText} />

        {/* Voice & Settings Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginTop: "24px",
          }}
        >
          <VoiceSelector
            selectedVoice={selectedVoice}
            onSelect={setSelectedVoice}
          />
          <VoiceSettings settings={settings} onChange={setSettings} />
        </div>

        {/* Error message */}
        {error && (
          <div
            style={{
              marginTop: "20px",
              padding: "12px 18px",
              borderRadius: "var(--radius-sm)",
              background: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              color: "var(--accent-red)",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              animation: "fadeIn 0.3s ease-out",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            {error}
            <button
              onClick={() => setError(null)}
              style={{
                marginLeft: "auto",
                background: "none",
                border: "none",
                color: "var(--accent-red)",
                cursor: "pointer",
                padding: "2px",
                fontSize: "16px",
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Generate Button */}
        <div style={{ marginTop: "24px" }}>
          <GenerateButton
            onClick={handleGenerate}
            disabled={!canGenerate}
            isLoading={isLoading}
          />
        </div>

        {/* Audio Player */}
        <div style={{ marginTop: "28px" }}>
          <AudioPlayer
            audioUrl={audioUrl}
            onDownload={handleDownload}
            isLoading={isLoading}
          />
        </div>
      </main>

      {/* ── Footer ──────────────────────────────── */}
      <footer
        style={{
          padding: "20px 32px",
          borderTop: "1px solid var(--border-subtle)",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            color: "var(--text-muted)",
          }}
        >
          Powered by Microsoft Neural Voices · Built with Next.js & FastAPI
        </p>
      </footer>
    </div>
  );
}
