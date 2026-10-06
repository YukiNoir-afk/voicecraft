@echo off
echo Starting VoiceCraft Backend...
start "VoiceCraft Backend" cmd /k "cd backend && python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

echo Starting VoiceCraft Frontend...
start "VoiceCraft Frontend" cmd /k "cd frontend && npm run dev"

echo VoiceCraft is starting!
echo Backend will run on http://localhost:8000
echo Frontend will run on http://localhost:3000
