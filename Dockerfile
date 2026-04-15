FROM node:24-alpine AS builder

WORKDIR /workspace

COPY package.json package-lock.json .

RUN npm install

COPY . .


FROM node:24-alpine

WORKDIR /app

COPY --from=builder /workspace/node_modules /app/node_modules
COPY --from=builder /workspace/src /app/src
COPY --from=builder /workspace/package.json /app/

EXPOSE 3000

ENTRYPOINT ["node", "src/main.js"]
