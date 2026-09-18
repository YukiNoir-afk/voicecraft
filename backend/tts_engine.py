"""
VoiceCraft TTS Engine — Edge TTS Wrapper
Provides async functions to list voices and generate speech audio.
"""

import edge_tts
from typing import Optional, AsyncGenerator
import json

# Cache voices list to avoid repeated API calls
_voices_cache: Optional[list] = None


async def list_voices(locale: Optional[str] = None) -> list:
    """
    List all available Edge TTS voices.
    Optionally filter by locale (e.g., 'en-US', 'vi-VN', 'ja-JP').
    Results are cached after first call.
    """
    global _voices_cache

    if _voices_cache is None:
        _voices_cache = await edge_tts.list_voices()

    voices = _voices_cache

    if locale:
        locale_lower = locale.lower()
        voices = [v for v in voices if v["Locale"].lower().startswith(locale_lower)]

    # Transform to a cleaner format
    result = []
    for v in voices:
        result.append({
            "id": v["ShortName"],
            "name": v["FriendlyName"],
            "shortName": v["ShortName"],
            "locale": v["Locale"],
            "language": v["Locale"].split("-")[0],
            "gender": v["Gender"],
            "contentCategories": v.get("VoiceTag", {}).get("ContentCategories", []),
            "voicePersonalities": v.get("VoiceTag", {}).get("VoicePersonalities", []),
        })

    return result


async def generate_audio_stream(
    text: str,
    voice: str = "en-US-EmmaNeural",
    rate: str = "+0%",
    pitch: str = "+0Hz",
    volume: str = "+0%",
) -> AsyncGenerator[bytes, None]:
    """
    Generate TTS audio as an async stream of bytes (MP3 format).
    
    Args:
        text: The text to convert to speech
        voice: Voice short name (e.g., 'en-US-EmmaNeural')
        rate: Speech rate adjustment (e.g., '+10%', '-20%')
        pitch: Pitch adjustment (e.g., '+50Hz', '-20Hz')
        volume: Volume adjustment (e.g., '+10%', '-50%')
    
    Yields:
        Audio data chunks (MP3)
    """
    communicate = edge_tts.Communicate(
        text=text,
        voice=voice,
        rate=rate,
        pitch=pitch,
        volume=volume,
    )

    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            yield chunk["data"]


async def generate_audio_bytes(
    text: str,
    voice: str = "en-US-EmmaNeural",
    rate: str = "+0%",
    pitch: str = "+0Hz",
    volume: str = "+0%",
) -> bytes:
    """
    Generate TTS audio and return complete bytes (MP3 format).
    Useful for download endpoint.
    """
    audio_chunks = []
    async for chunk in generate_audio_stream(text, voice, rate, pitch, volume):
        audio_chunks.append(chunk)
    return b"".join(audio_chunks)


def format_rate(value: int) -> str:
    """Convert rate slider value (-50 to 100) to Edge TTS format."""
    if value >= 0:
        return f"+{value}%"
    return f"{value}%"


def format_pitch(value: int) -> str:
    """Convert pitch slider value (-50 to 50) to Edge TTS format."""
    if value >= 0:
        return f"+{value}Hz"
    return f"{value}Hz"


def format_volume(value: int) -> str:
    """Convert volume slider value (-50 to 50) to Edge TTS format."""
    if value >= 0:
        return f"+{value}%"
    return f"{value}%"
