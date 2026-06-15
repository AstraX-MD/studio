FROM node:20-slim

# Install system dependencies for Baileys/Puppeteer if needed
RUN apt-get update && apt-get install -y \
    git \
    ffmpeg \
    imagemagick \
    webp \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

# Create sessions directory
RUN mkdir -p sessions && chmod 777 sessions

EXPOSE 9002

CMD ["npm", "start"]
