
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import whisper
import tempfile
import os

app = FastAPI(
    title="Advanced Audio Transcription API",
    description="High-quality offline transcription of audio files in multiple languages (Hindi, Gujarati, English, etc.). No API key needed."
)

# Load Whisper model once at startup for performance
model = whisper.load_model("base")

@app.post("/transcribe/")
async def transcribe_audio(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(('.mp3', '.wav', '.m4a', '.flac', '.ogg')):
        raise HTTPException(status_code=400, detail="Unsupported audio format.")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".audio") as temp_audio:
        temp_audio.write(await file.read())
        temp_audio_path = temp_audio.name

    try:
        result = model.transcribe(temp_audio_path)
        transcription_text = result["text"]
        language_detected = result["language"]

        return JSONResponse(content={
            "filename": file.filename,
            "transcription": transcription_text,
            "language_detected": language_detected
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")

    finally:
        if os.path.exists(temp_audio_path):
            os.remove(temp_audio_path)

@app.get("/")
async def root():
    return {"message": "Welcome to the Advanced Audio Transcription API. Use /transcribe/ to transcribe audio files."}
