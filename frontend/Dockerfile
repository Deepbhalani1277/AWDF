# Stage 1: Build & Serve Frontend
FROM node:18 AS build

WORKDIR /app

# Install dependencies first for optimal Docker layer caching
COPY package*.json ./
RUN npm install

# Copy frontend source code and compile production assets
COPY . .
RUN npm run build

# Expose Vite preview port
EXPOSE 5173

# Run Vite preview server bound to all interfaces
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
