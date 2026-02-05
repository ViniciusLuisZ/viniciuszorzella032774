# ---------- build ----------
FROM node:20 AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------- runtime ----------
FROM nginx:alpine

# SPA: fallback de rotas
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia o build do Angular
# (o Angular costuma gerar em dist/<nome-do-projeto>/browser OU dist/<nome-do-projeto>)
COPY --from=build /app/dist/artista-front/browser /usr/share/nginx/html

EXPOSE 80
