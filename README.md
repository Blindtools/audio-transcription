# WhatsApp Bot: Fixed Docker Deployment for Render

This version fixes the "Chrome not found" and "Port Timeout" errors on Render.

## 1. Why this version works:
- **Manual Chrome Install**: The `Dockerfile` now manually installs `google-chrome-stable` into the container.
- **Web Server**: `index.js` now starts a simple web server on port `10000` (or the port Render provides) to satisfy Render's health checks.
- **Explicit Path**: The script is now hardcoded to look for Chrome at `/usr/bin/google-chrome-stable`.

## 2. How to Deploy:
1.  **Push to GitHub**: Push all files in this ZIP to your repository.
2.  **Render Dashboard**:
    - Create a **Web Service**.
    - Connect your repo.
    - Render will build using the `Dockerfile`.
3.  **No Environment Variables**: You still don't need to add any manual environment variables in the Render dashboard; everything is handled inside the files.

## 3. How to Scan QR Code:
1.  Go to the **Logs** tab in Render.
2.  Wait for the build to finish and the service to start.
3.  The QR code will appear in the logs.
4.  Scan it with your phone (WhatsApp -> Linked Devices).

## 4. Usage:
Once connected, send `!testbuttons` to the bot.
