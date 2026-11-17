# syntax=docker/dockerfile:1
# ㈜청연메디칼 홈페이지 — 운영 이미지
# Node 26: 내장 node:sqlite 사용 (별도 네이티브 모듈 불필요)

FROM node:26-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM node:26-slim AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:26-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    DATA_DIR=/app/data

# standalone 서버 + 정적 파일 + 초기 자료(브로셔 PDF)
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/seed ./seed
RUN mkdir -p /app/data && chown node:node /app/data

USER node
EXPOSE 3000
# DB(site.db)와 첨부파일(uploads/)은 이 볼륨에 보관 — 컨테이너를 바꿔도 유지됨
VOLUME ["/app/data"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
