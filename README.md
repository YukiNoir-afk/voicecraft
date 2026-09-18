# 🎙️ VoiceCraft — AI Text-to-Speech

> Generate natural-sounding speech from text using 400+ premium Microsoft Neural voices. Free, fast, and incredibly natural.

![VoiceCraft](https://img.shields.io/badge/VoiceCraft-AI%20TTS-8b5cf6?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIGQ9Ik0xMiAyYTMgMyAwIDAgMC0zIDN2N2EzIDMgMCAwIDAgNiAwVjVhMyAzIDAgMCAwLTMtM1oiLz48cGF0aCBkPSJNMTkgMTB2MmE3IDcgMCAwIDEtMTQgMHYtMiIvPjxsaW5lIHgxPSIxMiIgeDI9IjEyIiB5MT0iMTkiIHkyPSIyMiIvPjwvc3ZnPg==)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi)
![Edge TTS](https://img.shields.io/badge/Edge%20TTS-Neural-blue?style=flat-square)

## ✨ Features

- 🎤 **400+ Neural Voices** — Microsoft's highest quality AI voices
- 🌍 **50+ Languages** — English, Vietnamese, Japanese, Korean, Chinese, French, German, and more
- 🆓 **Completely Free** — No API key, no subscription required
- ⚡ **Speed/Pitch/Volume** — Fine-tune voice parameters with real-time controls
- 🎵 **Waveform Visualization** — Web Audio API powered visualizer
- 📥 **Download MP3** — Export generated audio instantly
- 🌙 **Premium Dark UI** — Glassmorphism, animations, inspired by ElevenLabs

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/voicecraft.git
cd voicecraft

# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install
```

### 2. Run

```bash
# Terminal 1 — Backend (port 8000)
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2 — Frontend (port 3000)
cd frontend
npm run dev
```

### 3. Open

Visit **http://localhost:3000** 🎉

## 🏗️ Architecture

```
voicecraft/
├── backend/               # Python FastAPI
│   ├── main.py            # API routes: /api/tts, /api/voices
│   ├── tts_engine.py      # Edge TTS wrapper
│   └── requirements.txt
│
├── frontend/              # Next.js + TypeScript
│   └── src/
│       ├── app/           # Pages & layout
│       ├── components/    # UI components
│       └── lib/           # API client
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/voices?locale=vi-VN` | List voices (optional locale filter) |
| `POST` | `/api/tts` | Generate speech (streaming MP3) |
| `POST` | `/api/tts/download` | Generate & download MP3 |

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS
- **Backend**: Python, FastAPI, Edge TTS
- **Audio**: Web Audio API (waveform visualization)
- **TTS Engine**: Microsoft Neural Voices (via Edge TTS)

## 📄 License

MIT
