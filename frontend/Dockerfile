FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/dist/frontend ./dist/frontend

EXPOSE 4000

CMD ["node", "dist/frontend/server/server.mjs"]