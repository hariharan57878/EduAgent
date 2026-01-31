from flask import Flask, request, send_file
import io
import torch
import soundfile as sf
import os

try:
    from qwen_tts import Qwen3TTSModel
except ImportError:
    print("Error: qwen-tts not found. Please install it with 'pip install qwen-tts'")
    Qwen3TTSModel = None

app = Flask(__name__)

# Initialize Model
model = None

def load_model():
    global model
    if model is None and Qwen3TTSModel is not None:
        try:
            print("Loading Qwen3-TTS Model... (This may take a while)")
            # Check for GPU
            device = "cuda:0" if torch.cuda.is_available() else "cpu"
            print(f"Using device: {device}")
            
            # Use bfloat16 if on GPU and supported, else float32 for CPU safety
            dtype = torch.bfloat16 if (device != "cpu" and torch.cuda.is_bf16_supported()) else torch.float32
            
            model = Qwen3TTSModel.from_pretrained(
                "Qwen/Qwen3-TTS-12Hz-1.7B-CustomVoice",
                device_map=device,
                dtype=dtype,
                attn_implementation=None # Auto-select
            )
            print("Model loaded successfully!")
        except Exception as e:
            print(f"Failed to load model: {e}")

@app.route('/tts', methods=['POST'])
def generate_tts():
    global model
    if model is None:
        load_model()
        if model is None:
            return {"error": "Model failed to load"}, 500

    data = request.json
    text = data.get('text')
    # Default speaker 'Ryan' (English) or 'Vivian' (Chinese)
    speaker = data.get('speaker', 'Ryan') 
    
    if not text:
        return {"error": "No text provided"}, 400

    print(f"Generating TTS for: {text[:50]}... (Speaker: {speaker})")

    try:
        # Generate audio
        # Returns: wavs (list of numpy arrays), sr (sample rate)
        wavs, sr = model.generate_custom_voice(
            text=text,
            language="English", # Forcing English as per project context
            speaker=speaker
        )
        
        # Convert to WAV in memory
        buffer = io.BytesIO()
        sf.write(buffer, wavs[0], sr, format='WAV')
        buffer.seek(0)

        return send_file(buffer, mimetype='audio/wav')

    except Exception as e:
        print(f"Generation Error: {e}")
        return {"error": str(e)}, 500

if __name__ == '__main__':
    print("Starting TTS Server on port 8000...")
    # Pre-load model on startup (optional, better for first request speed)
    load_model()
    app.run(host='0.0.0.0', port=8000)
