FROM node:14-slim AS builder

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN npm run build
RUN npx tsc --project tsconfig.server.json

FROM node:14-alpine3.13 AS runner

WORKDIR /app
EXPOSE 3000

ENV NODE_ENV production

RUN addgroup -g 1001 nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

CMD ["node", "dist/server/server.js"]
