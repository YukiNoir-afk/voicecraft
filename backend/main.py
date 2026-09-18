"""
VoiceCraft Backend — FastAPI Application
REST API for Text-to-Speech using Edge TTS (Microsoft Neural Voices).
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import StreamingResponse, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
import tts_engine

app = FastAPI(
    title="VoiceCraft API",
    description="Text-to-Speech API powered by Microsoft Neural Voices",
    version="1.0.0",
)

# CORS — allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ──────────────────────────────────────────────
# Request/Response Models
# ──────────────────────────────────────────────

class TTSRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000, description="Text to convert to speech")
    voice: str = Field(default="en-US-EmmaNeural", description="Voice short name")
    rate: int = Field(default=0, ge=-50, le=100, description="Speech rate: -50 to +100 percent")
    pitch: int = Field(default=0, ge=-50, le=50, description="Pitch: -50 to +50 Hz")
    volume: int = Field(default=0, ge=-50, le=50, description="Volume: -50 to +50 percent")


# ──────────────────────────────────────────────
# API Routes
# ──────────────────────────────────────────────

@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "service": "VoiceCraft API"}


@app.get("/api/voices")
async def get_voices(locale: Optional[str] = Query(None, description="Filter by locale, e.g. 'en-US', 'vi-VN', 'ja-JP'")):
    """
    List all available TTS voices.
    Optionally filter by locale prefix.
    """
    try:
        voices = await tts_engine.list_voices(locale)
        return {
            "voices": voices,
            "total": len(voices),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch voices: {str(e)}")


@app.post("/api/tts")
async def text_to_speech(request: TTSRequest):
    """
    Convert text to speech. Returns streaming MP3 audio.
    """
    try:
        rate_str = tts_engine.format_rate(request.rate)
        pitch_str = tts_engine.format_pitch(request.pitch)
        volume_str = tts_engine.format_volume(request.volume)

        return StreamingResponse(
            tts_engine.generate_audio_stream(
                text=request.text,
                voice=request.voice,
                rate=rate_str,
                pitch=pitch_str,
                volume=volume_str,
            ),
            media_type="audio/mpeg",
            headers={
                "Content-Disposition": "inline; filename=voicecraft_audio.mp3",
            },
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS generation failed: {str(e)}")


@app.post("/api/tts/download")
async def download_audio(request: TTSRequest):
    """
    Convert text to speech and return as downloadable MP3 file.
    """
    try:
        rate_str = tts_engine.format_rate(request.rate)
        pitch_str = tts_engine.format_pitch(request.pitch)
        volume_str = tts_engine.format_volume(request.volume)

        audio_bytes = await tts_engine.generate_audio_bytes(
            text=request.text,
            voice=request.voice,
            rate=rate_str,
            pitch=pitch_str,
            volume=volume_str,
        )

        return Response(
            content=audio_bytes,
            media_type="audio/mpeg",
            headers={
                "Content-Disposition": "attachment; filename=voicecraft_audio.mp3",
                "Content-Length": str(len(audio_bytes)),
            },
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS download failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
