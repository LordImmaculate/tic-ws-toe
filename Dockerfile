FROM oven/bun:latest

WORKDIR /app

COPY ./packages/server/package.json ./packages/server/
COPY ./packages/server/prisma ./packages/server/prisma
COPY ./packages/server ./packages/server

WORKDIR /app/packages/server

RUN bun install

RUN bun prisma generate

EXPOSE 3000
EXPOSE 3001

ARG ENV=prod

CMD ["bun", "src/main.ts", "--", "$ENV"]