# Use a Node.js image with Chromium pre-installed
FROM ghcr.io/puppeteer/puppeteer:latest

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
# Note: puppeteer is already in the base image, but we install the project ones
RUN npm install

# Copy the rest of the code
COPY . .

# Render uses the PORT environment variable, but for a WhatsApp bot 
# we don't necessarily need an open port. However, Render Web Services 
# require one. We'll start a dummy server if needed or just run the bot.
# CMD ["node", "index.js"]

# If you want to use the pre-installed Chrome in this image:
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Start the bot
CMD ["node", "index.js"]
