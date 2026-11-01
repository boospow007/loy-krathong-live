FROM oven/bun:1.3.14 AS bun
FROM node:22-bookworm-slim
COPY --from=bun /usr/local/bin/bun /usr/local/bin/bun
ENV NODE_ENV=production
WORKDIR /app
COPY .output ./.output
COPY dist/api.mjs ./api.mjs
USER node
CMD ["node", ".output/server/index.mjs"]
