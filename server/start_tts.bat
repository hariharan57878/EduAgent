@echo off
echo Installing Python dependencies for Qwen-TTS...
cd python_tts
pip install -r requirements.txt

echo Starting Qwen-TTS Service...
python tts_service.py
pause
