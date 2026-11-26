# Two-stage build for a single-origin deployment (client + API in one service).
FROM node:20-alpine AS build
WORKDIR /app
COPY client/package.json client/package-lock.json ./client/
RUN npm ci --prefix client
COPY client ./client
# Empty VITE_API_URL makes the browser call /api/... on its own origin.
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build --prefix client

FROM node:20-alpine AS runtime
ENV NODE_ENV=production
ENV SERVE_CLIENT=true
ENV PORT=8080
WORKDIR /app
COPY Backend/package.json Backend/package-lock.json ./Backend/
RUN npm ci --omit=dev --prefix Backend
COPY Backend ./Backend
COPY --from=build /app/client/dist ./client/dist
EXPOSE 8080
CMD ["node", "Backend/server.js"]
