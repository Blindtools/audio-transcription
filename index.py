from flask import Flask, request, jsonify
from flask_cors import CORS
import g4f
import pytesseract
from PIL import Image
import os

app = Flask(__name__)
CORS(app)

API_INFO = {
    "about": "This is a custom public GPT-5 API created by Shaikh Juned",
    "created_by": "Shaikh Juned",
    "model": "GPT-5 (via g4f library proxy)",
    "usage": "Unlimited usage subject to server limits"
}

@app.route('/')
def home():
    return jsonify(API_INFO)

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    prompt = data.get('prompt')
    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    try:
        response = g4f.ChatCompletion.create(
            model="gpt-5",
            messages=[{"role": "user", "content": prompt}]
        )
        return jsonify({"response": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/file-analyze', methods=['POST'])
def file_analyze():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    try:
        content = file.read().decode('utf-8')
        analysis = g4f.ChatCompletion.create(
            model="gpt-5",
            messages=[{"role": "user", "content": f"Analyze the following content:\\n{content}"}]
        )
        return jsonify({"analysis": analysis})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/image-analyze', methods=['POST'])
def image_analyze():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400

    image = request.files['image']
    try:
        img = Image.open(image)
        text = pytesseract.image_to_string(img)
        analysis = g4f.ChatCompletion.create(
            model="gpt-5",
            messages=[{"role": "user", "content": f"Analyze this extracted text:\\n{text}"}]
        )
        return jsonify({"extracted_text": text, "analysis": analysis})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/system-info', methods=['GET'])
def system_info():
    return jsonify(API_INFO)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
