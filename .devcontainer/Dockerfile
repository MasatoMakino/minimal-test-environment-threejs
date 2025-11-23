# Use Ubuntu 24.04 (same as GitHub Actions ubuntu-latest)
FROM ubuntu:24.04

# Avoid interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install Node.js 22.x, Git, Xvfb and Google Chrome
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    gnupg \
    git \
    xvfb \
    # Add Google Chrome repository
    && curl -fsSL https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/google-chrome.gpg \
    && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-chrome.gpg] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
    &&  apt-get update \
    && apt-get install -y --no-install-recommends google-chrome-stable \
    # Install Node.js
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user (same as CI environment)
RUN useradd -m -s /bin/bash runner

# Verify installations
RUN node --version && npm --version && google-chrome --version
