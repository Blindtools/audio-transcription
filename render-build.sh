#!/usr/bin/env bash
# exit on error
set -o errexit

npm install

# Install Chrome for Puppeteer
# This ensures Chrome is available in the Render environment
npx puppeteer browsers install chrome

# Find the executable path and set it for the environment (optional, but helpful for debugging)
echo "Finding Chrome executable path..."
find /opt/render/.cache/puppeteer -name chrome
