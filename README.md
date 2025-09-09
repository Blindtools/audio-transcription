
# Advanced Audio Transcription API

This API provides advanced offline audio transcription in multiple languages (Hindi, Gujarati, English, etc.) using OpenAI Whisper.

## Features
- No API keys required
- Fully offline
- Supports long audio files
- High accuracy
- Easy deployment

## Usage Example

### Transcribe Audio

```bash
curl -X POST "https://your-app.onrender.com/transcribe/" \

-F "file=@your_audio_file.mp3"
```

Response:
```json
{
  "filename": "your_audio_file.mp3",
  "transcription": "This is the transcribed text...",
  "language_detected": "english"
}
```

## Deployment

Deploy easily on Render.com or any Docker-compatible service.

```
docker build -t audio-transcription-api .
docker run -p 8080:8080 audio-transcription-api
```
