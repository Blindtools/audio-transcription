# WhatsApp Bot: Zero-Config Deployment (Docker)

This version uses **Docker**, which is the most reliable way to deploy on Render without manually setting environment variables. Docker packages the correct version of Chrome inside the "container" so it just works.

## 1. How to Deploy (No Env Vars Needed)

1.  **GitHub**: Push these files to your GitHub repository (including the `Dockerfile`).
2.  **Render Dashboard**: 
    - Create a new **Web Service**.
    - Connect your repo.
    - Render will automatically detect the `Dockerfile`.
3.  **That's it!**: Render will build the image and start the bot. You don't need to add any environment variables in the dashboard.

## 2. Why this works
- The `Dockerfile` uses a base image (`ghcr.io/puppeteer/puppeteer`) that already has Chrome installed.
- The `index.js` script has "Auto-Detection" logic to find Chrome wherever it is hidden in the system.

## 3. Important Note
Render Web Services expect a web server to be running on a port. Since this is a WhatsApp bot, it doesn't "listen" for web traffic. Render might show a "Port Timeout" error even if the bot is working. 

**To fix the "Port Timeout" (Optional):**
If Render keeps restarting your bot because it doesn't see a web server, you can add a simple Express server to `index.js`, but for a basic bot, the Docker logs will show you the QR code regardless.

## 4. Usage
Once the logs show the QR code, scan it. Then send `!testbuttons` to your bot.
