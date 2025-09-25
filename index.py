from flask import Flask, render_template_string
import datetime
import requests

app = Flask(__name__)

# HTML Template for homepage
homepage_html = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Flask Homepage</title>
    <style>
        body { font-family: Arial, sans-serif; background:#111; color:#fff; text-align:center; padding:40px; }
        .card { background:#222; padding:20px; margin:20px auto; border-radius:12px; max-width:500px; box-shadow:0 4px 10px rgba(0,0,0,0.5); }
        h1 { color:#4CAF50; }
        .btn { background:#4CAF50; color:white; padding:10px 20px; border:none; border-radius:8px; cursor:pointer; margin:10px; }
        .btn:hover { background:#45a049; }
    </style>
</head>
<body>
    <div class="card">
        <h1>Welcome to My Homepage</h1>
        <p><strong>Date & Time:</strong> {{ datetime }}</p>
        <p><strong>Quote of the Day:</strong> {{ quote }}</p>
        <p><strong>Temperature:</strong> {{ temperature }}°C</p>
        <button class="btn" onclick="alert('Contact Page Coming Soon!')">Contact</button>
        <button class="btn" onclick="alert('About Page Coming Soon!')">About</button>
        <button class="btn" onclick="alert('Feedback Page Coming Soon!')">Feedback</button>
    </div>
</body>
</html>
"""

# Fetch a quote from free API
def get_quote():
    try:
        res = requests.get("https://api.quotable.io/random", timeout=5)
        if res.status_code == 200:
            return res.json().get("content", "Stay positive!")
    except:
        return "Keep going, never give up!"

# Fetch temperature (example: Ahmedabad, India)
def get_temperature():
    try:
        url = "https://api.open-meteo.com/v1/forecast?latitude=23.03&longitude=72.58&current_weather=true"
        res = requests.get(url, timeout=5)
        if res.status_code == 200:
            return res.json()["current_weather"]["temperature"]
    except:
        return "N/A"

@app.route("/")
def home():
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return render_template_string(
        homepage_html,
        datetime=now,
        quote=get_quote(),
        temperature=get_temperature()
    )

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
