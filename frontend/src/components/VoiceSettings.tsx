"use client";

import { TTSSettings } from "@/lib/api";

interface VoiceSettingsProps {
  settings: TTSSettings;
  onChange: (settings: TTSSettings) => void;
}

interface SliderConfig {
  key: keyof TTSSettings;
  label: string;
  icon: string;
  min: number;
  max: number;
  unit: string;
  description: string;
  color: string;
}

const SLIDERS: SliderConfig[] = [
  {
    key: "rate",
    label: "Speed",
    icon: "⚡",
    min: -50,
    max: 100,
    unit: "%",
    description: "Speaking rate",
    color: "#8b5cf6",
  },
  {
    key: "pitch",
    label: "Pitch",
    icon: "🎵",
    min: -50,
    max: 50,
    unit: "Hz",
    description: "Voice pitch",
    color: "#06b6d4",
  },
  {
    key: "volume",
    label: "Volume",
    icon: "🔊",
    min: -50,
    max: 50,
    unit: "%",
    description: "Audio volume",
    color: "#10b981",
  },
];

export default function VoiceSettings({ settings, onChange }: VoiceSettingsProps) {
  const handleChange = (key: keyof TTSSettings, value: number) => {
    onChange({ ...settings, [key]: value });
  };

  const handleReset = () => {
    onChange({ rate: 0, pitch: 0, volume: 0 });
  };

  const isDefault =
    settings.rate === 0 && settings.pitch === 0 && settings.volume === 0;

  return (
    <div className="animate-fade-in-d3">
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
          Voice Settings
        </label>
        {!isDefault && (
          <button
            onClick={handleReset}
            style={{
              fontSize: "11px",
              color: "var(--text-tertiary)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              padding: "4px 8px",
              borderRadius: "var(--radius-sm)",
              transition: "all var(--transition-fast)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--text-primary)";
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-tertiary)";
              e.currentTarget.style.background = "none";
            }}
          >
            Reset
          </button>
        )}
      </div>

      <div
        className="glass-card"
        style={{
          padding: "20px",
          borderRadius: "var(--radius-md)",
          display: "flex",
          flexDirection: "column",
          gap: "22px",
        }}
      >
        {SLIDERS.map((slider) => {
          const value = settings[slider.key];
          const percent =
            ((value - slider.min) / (slider.max - slider.min)) * 100;

          return (
            <div key={slider.key}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span style={{ fontSize: "14px" }}>{slider.icon}</span>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "var(--text-primary)",
                    }}
                  >
                    {slider.label}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: slider.color,
                    fontVariantNumeric: "tabular-nums",
                    minWidth: "60px",
                    textAlign: "right",
                  }}
                >
                  {value > 0 ? "+" : ""}
                  {value}
                  {slider.unit}
                </span>
              </div>

              <div style={{ position: "relative" }}>
                {/* Track fill */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: 0,
                    transform: "translateY(-50%)",
                    height: "4px",
                    width: `${percent}%`,
                    borderRadius: "2px",
                    background: `linear-gradient(90deg, ${slider.color}66, ${slider.color})`,
                    pointerEvents: "none",
                    zIndex: 1,
                  }}
                />
                <input
                  id={`setting-${slider.key}`}
                  type="range"
                  min={slider.min}
                  max={slider.max}
                  value={value}
                  onChange={(e) =>
                    handleChange(slider.key, parseInt(e.target.value))
                  }
                  style={{
                    position: "relative",
                    zIndex: 2,
                    accentColor: slider.color,
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "4px",
                  fontSize: "10px",
                  color: "var(--text-muted)",
                }}
              >
                <span>
                  {slider.min}
                  {slider.unit}
                </span>
                <span>
                  {slider.max}
                  {slider.unit}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
