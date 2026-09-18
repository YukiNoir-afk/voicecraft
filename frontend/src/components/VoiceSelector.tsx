"use client";

import { useState, useEffect, useMemo } from "react";
import { Voice, fetchVoices, getLocaleFlag, getLanguageName } from "@/lib/api";

interface VoiceSelectorProps {
  selectedVoice: string;
  onSelect: (voiceId: string) => void;
}

const POPULAR_LANGUAGES = ["en", "vi", "ja", "ko", "zh", "fr", "de", "es", "pt", "ru"];

export default function VoiceSelector({ selectedVoice, onSelect }: VoiceSelectorProps) {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [search, setSearch] = useState("");
  const [filterLang, setFilterLang] = useState<string>("");
  const [filterGender, setFilterGender] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVoices();
  }, []);

  const loadVoices = async () => {
    try {
      setLoading(true);
      const res = await fetchVoices();
      setVoices(res.voices);
    } catch (err) {
      setError("Unable to load voices. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  // Get unique languages
  const languages = useMemo(() => {
    const langSet = new Map<string, string>();
    voices.forEach((v) => {
      const lang = v.language;
      if (!langSet.has(lang)) {
        langSet.set(lang, v.locale);
      }
    });
    // Sort: popular languages first
    return Array.from(langSet.entries()).sort(([a], [b]) => {
      const aIdx = POPULAR_LANGUAGES.indexOf(a);
      const bIdx = POPULAR_LANGUAGES.indexOf(b);
      if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
      if (aIdx !== -1) return -1;
      if (bIdx !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [voices]);

  // Filter voices
  const filteredVoices = useMemo(() => {
    return voices.filter((v) => {
      if (filterLang && v.language !== filterLang) return false;
      if (filterGender && v.gender.toLowerCase() !== filterGender) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          v.name.toLowerCase().includes(q) ||
          v.shortName.toLowerCase().includes(q) ||
          v.locale.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [voices, filterLang, filterGender, search]);

  const selectedVoiceObj = voices.find((v) => v.id === selectedVoice);

  return (
    <div className="animate-fade-in-d2">
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
        Voice
      </label>

      <div
        className="glass-card"
        style={{ padding: "16px", borderRadius: "var(--radius-md)" }}
      >
        {/* Selected voice display */}
        {selectedVoiceObj && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "14px",
              padding: "10px 14px",
              background: "var(--accent-purple-soft)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid rgba(139, 92, 246, 0.2)",
            }}
          >
            <span style={{ fontSize: "20px" }}>
              {getLocaleFlag(selectedVoiceObj.locale)}
            </span>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                }}
              >
                {selectedVoiceObj.shortName.split("-").slice(2).join("-").replace("Neural", "")}
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>
                {selectedVoiceObj.locale} · {selectedVoiceObj.gender}
              </div>
            </div>
            <span
              style={{
                fontSize: "10px",
                padding: "2px 8px",
                borderRadius: "var(--radius-pill)",
                background: "var(--accent-purple)",
                color: "white",
                fontWeight: 600,
              }}
            >
              Selected
            </span>
          </div>
        )}

        {/* Search */}
        <div style={{ position: "relative", marginBottom: "12px" }}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-tertiary)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            id="voice-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search voices..."
            style={{
              width: "100%",
              padding: "10px 12px 10px 38px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-sm)",
              color: "var(--text-primary)",
              fontSize: "13px",
              outline: "none",
              fontFamily: "'Inter', sans-serif",
              transition: "all var(--transition-fast)",
            }}
          />
        </div>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "12px",
            flexWrap: "wrap",
          }}
        >
          {/* Language filter */}
          <select
            id="voice-language-filter"
            value={filterLang}
            onChange={(e) => setFilterLang(e.target.value)}
            style={{
              flex: 1,
              minWidth: "120px",
              padding: "8px 12px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-sm)",
              color: "var(--text-primary)",
              fontSize: "12px",
              outline: "none",
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <option value="" style={{ background: "var(--bg-secondary)" }}>
              All Languages
            </option>
            {languages.map(([lang, locale]) => (
              <option
                key={lang}
                value={lang}
                style={{ background: "var(--bg-secondary)" }}
              >
                {getLocaleFlag(locale)} {getLanguageName(locale)}
              </option>
            ))}
          </select>

          {/* Gender filter */}
          <select
            id="voice-gender-filter"
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            style={{
              minWidth: "100px",
              padding: "8px 12px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-sm)",
              color: "var(--text-primary)",
              fontSize: "12px",
              outline: "none",
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <option value="" style={{ background: "var(--bg-secondary)" }}>All Genders</option>
            <option value="female" style={{ background: "var(--bg-secondary)" }}>♀ Female</option>
            <option value="male" style={{ background: "var(--bg-secondary)" }}>♂ Male</option>
          </select>
        </div>

        {/* Voice list */}
        <div
          style={{
            maxHeight: "240px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          {loading && (
            <div
              style={{
                textAlign: "center",
                padding: "30px",
                color: "var(--text-tertiary)",
                fontSize: "13px",
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  border: "2px solid var(--border-subtle)",
                  borderTopColor: "var(--accent-purple)",
                  borderRadius: "50%",
                  animation: "spin-slow 0.8s linear infinite",
                  margin: "0 auto 12px",
                }}
              />
              Loading voices...
            </div>
          )}

          {error && (
            <div
              style={{
                textAlign: "center",
                padding: "24px",
                color: "var(--accent-red)",
                fontSize: "13px",
              }}
            >
              <div style={{ marginBottom: "8px" }}>⚠️ {error}</div>
              <button
                onClick={loadVoices}
                style={{
                  padding: "6px 16px",
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--accent-red)",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && filteredVoices.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "24px",
                color: "var(--text-tertiary)",
                fontSize: "13px",
              }}
            >
              No voices found
            </div>
          )}

          {filteredVoices.map((voice) => {
            const isSelected = voice.id === selectedVoice;
            const displayName = voice.shortName
              .split("-")
              .slice(2)
              .join("-")
              .replace("Neural", "");

            return (
              <button
                key={voice.id}
                onClick={() => onSelect(voice.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 12px",
                  background: isSelected
                    ? "var(--accent-purple-soft)"
                    : "transparent",
                  border: isSelected
                    ? "1px solid rgba(139, 92, 246, 0.2)"
                    : "1px solid transparent",
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                  transition: "all var(--transition-fast)",
                  fontFamily: "'Inter', sans-serif",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                <span style={{ fontSize: "18px", flexShrink: 0 }}>
                  {getLocaleFlag(voice.locale)}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: isSelected ? 600 : 500,
                      color: isSelected
                        ? "var(--accent-purple)"
                        : "var(--text-primary)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {displayName}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--text-tertiary)",
                    }}
                  >
                    {voice.locale}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "10px",
                    padding: "2px 6px",
                    borderRadius: "var(--radius-pill)",
                    background:
                      voice.gender.toLowerCase() === "female"
                        ? "rgba(236, 72, 153, 0.1)"
                        : "rgba(59, 130, 246, 0.1)",
                    color:
                      voice.gender.toLowerCase() === "female"
                        ? "#ec4899"
                        : "#3b82f6",
                    fontWeight: 500,
                    flexShrink: 0,
                  }}
                >
                  {voice.gender === "Female" ? "♀" : "♂"}
                </span>
              </button>
            );
          })}
        </div>

        {!loading && !error && (
          <div
            style={{
              marginTop: "10px",
              paddingTop: "10px",
              borderTop: "1px solid var(--border-subtle)",
              fontSize: "11px",
              color: "var(--text-muted)",
              textAlign: "center",
            }}
          >
            {filteredVoices.length} of {voices.length} voices
          </div>
        )}
      </div>
    </div>
  );
}
