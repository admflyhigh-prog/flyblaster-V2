# Fly Blaster API — Node backend (replaces Supabase + n8n)
FROM node:22-alpine

WORKDIR /app

# Install deps first (better layer caching)
COPY package.json ./
RUN npm install --omit=dev

# Copy source
COPY . .

# Expose API port
EXPOSE 8091

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD node -e "fetch('http://localhost:8091/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))" || exit 1

CMD ["node", "server.js"]
