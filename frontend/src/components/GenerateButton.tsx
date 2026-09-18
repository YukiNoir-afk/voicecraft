"use client";

interface GenerateButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
}

export default function GenerateButton({
  onClick,
  disabled,
  isLoading,
}: GenerateButtonProps) {
  return (
    <div
      className="animate-fade-in-d5"
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "8px",
      }}
    >
      <button
        id="generate-speech-btn"
        onClick={onClick}
        disabled={disabled || isLoading}
        style={{
          position: "relative",
          padding: "14px 48px",
          borderRadius: "var(--radius-pill)",
          border: "none",
          background:
            disabled && !isLoading
              ? "rgba(255,255,255,0.06)"
              : "linear-gradient(135deg, #8b5cf6, #7c3aed, #6d28d9)",
          color: disabled && !isLoading ? "var(--text-muted)" : "white",
          fontSize: "15px",
          fontWeight: 600,
          fontFamily: "'Inter', sans-serif",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all var(--transition-base)",
          boxShadow:
            disabled || isLoading
              ? "none"
              : "0 4px 24px rgba(139, 92, 246, 0.3)",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          letterSpacing: "0.01em",
        }}
        onMouseEnter={(e) => {
          if (!disabled && !isLoading) {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 8px 32px rgba(139, 92, 246, 0.4)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          if (!disabled) {
            e.currentTarget.style.boxShadow =
              "0 4px 24px rgba(139, 92, 246, 0.3)";
          }
        }}
      >
        {/* Shimmer effect */}
        {!disabled && !isLoading && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
              backgroundSize: "200% 100%",
              animation: "shimmer 3s ease-in-out infinite",
            }}
          />
        )}

        {isLoading ? (
          <>
            <div
              style={{
                width: "18px",
                height: "18px",
                border: "2px solid rgba(255,255,255,0.3)",
                borderTopColor: "white",
                borderRadius: "50%",
                animation: "spin-slow 0.7s linear infinite",
              }}
            />
            <span>Generating...</span>
          </>
        ) : (
          <>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
            <span>Generate Speech</span>
          </>
        )}
      </button>
    </div>
  );
}
