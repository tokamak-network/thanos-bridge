
FROM node:22-alpine AS builder

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json yarn.lock ./

RUN --mount=type=cache,id=yarn-$TARGETARCH,target=/usr/local/share/.cache/yarn \
    yarn install --ignore-optional --frozen-lockfile

COPY . .

RUN yarn build


FROM node:22-alpine AS production

WORKDIR /app

COPY --from=builder /app/ ./

EXPOSE 3000

CMD ["yarn", "start"]