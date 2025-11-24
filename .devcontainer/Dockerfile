# Use Node.js 22 official slim image (Debian Bookworm)
FROM node:22-bookworm-slim

# Avoid interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install dependencies and Google Chrome
RUN set -eux; \
    # Install base dependencies for Chrome repository setup
    apt-get update; \
    apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        gnupg \
    ; \
    # Add Google Chrome repository
    curl -fsSL https://dl.google.com/linux/linux_signing_key.pub \
        | gpg --dearmor -o /usr/share/keyrings/google-chrome.gpg; \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/google-chrome.gpg] http://dl.google.com/linux/chrome/deb/ stable main" \
        > /etc/apt/sources.list.d/google-chrome.list; \
    # Install Chrome and development tools
    apt-get update; \
    apt-get install -y --no-install-recommends \
        git \
        google-chrome-stable \
        xauth \
        xvfb \
    ; \
    # Clean up
    rm -rf /var/lib/apt/lists/*

# Verify installations (node user already exists in base image)
RUN node --version && npm --version && google-chrome --version
