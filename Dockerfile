FROM node:16-alpine AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:16-alpine AS BUILD_IMAGE

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn build

FROM node:16-alpine

WORKDIR /app

COPY --from=BUILD_IMAGE /app/package.json /app/yarn.lock ./
COPY --from=BUILD_IMAGE /app/node_modules ./node_modules
COPY --from=BUILD_IMAGE /app/public ./public
COPY --from=BUILD_IMAGE /app/.next ./.next
COPY --from=BUILD_IMAGE /app/next.config.js  ./
EXPOSE 3000

CMD [ "yarn", "start" ]
