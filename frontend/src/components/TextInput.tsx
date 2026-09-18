"use client";

import { useState } from "react";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

const MAX_CHARS = 5000;

export default function TextInput({ value, onChange, maxLength = MAX_CHARS }: TextInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const charCount = value.length;
  const charPercent = (charCount / maxLength) * 100;

  return (
    <div className="animate-fade-in-d1">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <label
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--text-secondary)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Text to Speech
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "40px",
              height: "3px",
              borderRadius: "2px",
              background: "rgba(255,255,255,0.06)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${charPercent}%`,
                height: "100%",
                borderRadius: "2px",
                background:
                  charPercent > 90
                    ? "var(--accent-red)"
                    : charPercent > 70
                    ? "var(--accent-orange)"
                    : "var(--accent-purple)",
                transition: "all var(--transition-fast)",
              }}
            />
          </div>
          <span
            style={{
              fontSize: "12px",
              color:
                charPercent > 90
                  ? "var(--accent-red)"
                  : "var(--text-tertiary)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {charCount.toLocaleString()} / {maxLength.toLocaleString()}
          </span>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          borderRadius: "var(--radius-md)",
          border: `1px solid ${
            isFocused ? "var(--border-focus)" : "var(--border-subtle)"
          }`,
          background: isFocused
            ? "rgba(255,255,255,0.04)"
            : "rgba(255,255,255,0.02)",
          transition: "all var(--transition-base)",
          boxShadow: isFocused ? "var(--shadow-glow)" : "none",
        }}
      >
        <textarea
          id="tts-text-input"
          value={value}
          onChange={(e) => {
            if (e.target.value.length <= maxLength) {
              onChange(e.target.value);
            }
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Enter the text you want to convert to speech... Type anything in English, Vietnamese, Japanese, or any supported language."
          rows={6}
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            resize: "vertical",
            padding: "16px 18px",
            fontSize: "15px",
            lineHeight: "1.7",
            color: "var(--text-primary)",
            fontFamily: "'Inter', sans-serif",
            minHeight: "160px",
            maxHeight: "400px",
          }}
        />
      </div>
    </div>
  );
}
