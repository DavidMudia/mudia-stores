FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install

COPY . .

RUN bun x prisma generate

EXPOSE 3000

CMD ["sh", "-c", "bun x prisma migrate deploy && bun src/index.ts"]