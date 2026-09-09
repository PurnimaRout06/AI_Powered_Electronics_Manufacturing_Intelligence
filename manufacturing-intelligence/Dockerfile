# Multi-stage build: compile the Vite app, then serve the static output
# with nginx. Build from the manufacturing-intelligence/ directory.

FROM node:20-alpine AS build
WORKDIR /app

# ARG + ENV so VITE_API_BASE_URL is baked into the compiled JS bundle at
# build time (Vite only reads import.meta.env values at build time, not
# runtime), matching the value docker-compose.yml passes in as a build arg.
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
# React Router needs all unknown paths to fall back to index.html — see
# nginx.conf for the `try_files` rule that makes deep links like
# /equipment/EQ-004 work on a hard refresh.
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
