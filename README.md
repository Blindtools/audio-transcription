# Shaikh Juned Incredible GPT-5 Public API

This is a custom advanced public API built using the g4f library.
It provides unlimited usage for text responses, file analysis, image analysis, and system info.

## Features
- Chat endpoint using GPT-5 (via g4f proxy)
- File analysis (upload text files)
- Image analysis (OCR + AI analysis)
- System info endpoint with creator metadata

## Deployment on Render
1. Push this repo to GitHub.
2. Create a new Web Service on Render.
3. Add build command:
   ```bash
   pip install -r requirements.txt
   ```
4. Add start command:
   ```bash
   python index.py
   ```
