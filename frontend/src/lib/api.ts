/**
 * VoiceCraft API Client
 * Handles communication with the FastAPI backend
 */

const API_BASE = "http://localhost:8000";

export interface Voice {
  id: string;
  name: string;
  shortName: string;
  locale: string;
  language: string;
  gender: string;
  contentCategories: string[];
  voicePersonalities: string[];
}

export interface VoicesResponse {
  voices: Voice[];
  total: number;
}

export interface TTSSettings {
  rate: number;   // -50 to 100
  pitch: number;  // -50 to 50
  volume: number; // -50 to 50
}

/**
 * Fetch all available voices, optionally filtered by locale
 */
export async function fetchVoices(locale?: string): Promise<VoicesResponse> {
  const params = locale ? `?locale=${encodeURIComponent(locale)}` : "";
  const response = await fetch(`${API_BASE}/api/voices${params}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch voices: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Generate speech audio from text
 * Returns a Blob containing the MP3 audio
 */
export async function generateSpeech(
  text: string,
  voice: string,
  settings: TTSSettings
): Promise<Blob> {
  const response = await fetch(`${API_BASE}/api/tts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      voice,
      rate: settings.rate,
      pitch: settings.pitch,
      volume: settings.volume,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail || "TTS generation failed");
  }

  return response.blob();
}

/**
 * Download audio as MP3 file
 */
export async function downloadAudio(
  text: string,
  voice: string,
  settings: TTSSettings
): Promise<void> {
  const response = await fetch(`${API_BASE}/api/tts/download`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      voice,
      rate: settings.rate,
      pitch: settings.pitch,
      volume: settings.volume,
    }),
  });

  if (!response.ok) {
    throw new Error("Download failed");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "voicecraft_audio.mp3";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Get a flag emoji for a locale
 */
export function getLocaleFlag(locale: string): string {
  const flagMap: Record<string, string> = {
    "af": "🇿🇦", "am": "🇪🇹", "ar": "🇸🇦", "az": "🇦🇿", "bg": "🇧🇬",
    "bn": "🇧🇩", "bs": "🇧🇦", "ca": "🇪🇸", "cs": "🇨🇿", "cy": "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
    "da": "🇩🇰", "de": "🇩🇪", "el": "🇬🇷", "en": "🇺🇸", "es": "🇪🇸",
    "et": "🇪🇪", "fa": "🇮🇷", "fi": "🇫🇮", "fil": "🇵🇭", "fr": "🇫🇷",
    "ga": "🇮🇪", "gl": "🇪🇸", "gu": "🇮🇳", "he": "🇮🇱", "hi": "🇮🇳",
    "hr": "🇭🇷", "hu": "🇭🇺", "id": "🇮🇩", "is": "🇮🇸", "it": "🇮🇹",
    "ja": "🇯🇵", "jv": "🇮🇩", "ka": "🇬🇪", "kk": "🇰🇿", "km": "🇰🇭",
    "kn": "🇮🇳", "ko": "🇰🇷", "lo": "🇱🇦", "lt": "🇱🇹", "lv": "🇱🇻",
    "mk": "🇲🇰", "ml": "🇮🇳", "mn": "🇲🇳", "mr": "🇮🇳", "ms": "🇲🇾",
    "mt": "🇲🇹", "my": "🇲🇲", "nb": "🇳🇴", "ne": "🇳🇵", "nl": "🇳🇱",
    "pl": "🇵🇱", "ps": "🇦🇫", "pt": "🇧🇷", "ro": "🇷🇴", "ru": "🇷🇺",
    "si": "🇱🇰", "sk": "🇸🇰", "sl": "🇸🇮", "so": "🇸🇴", "sq": "🇦🇱",
    "sr": "🇷🇸", "su": "🇮🇩", "sv": "🇸🇪", "sw": "🇹🇿", "ta": "🇮🇳",
    "te": "🇮🇳", "th": "🇹🇭", "tr": "🇹🇷", "uk": "🇺🇦", "ur": "🇵🇰",
    "uz": "🇺🇿", "vi": "🇻🇳", "zh": "🇨🇳", "zu": "🇿🇦",
  };
  const lang = locale.split("-")[0].toLowerCase();
  return flagMap[lang] || "🌐";
}

/**
 * Get display name for a language code
 */
export function getLanguageName(locale: string): string {
  try {
    const displayNames = new Intl.DisplayNames(["en"], { type: "language" });
    return displayNames.of(locale.split("-")[0]) || locale;
  } catch {
    return locale;
  }
}
