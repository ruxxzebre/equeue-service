FROM node:16-alpine3.11
RUN apk add gcc g++ make python

WORKDIR /app
COPY . .

WORKDIR /app/packages/shared
RUN yarn install --pure-lockfile --non-interactive

WORKDIR /app/packages/server
RUN yarn install --pure-lockfile --non-interactive
RUN yarn migrane

WORKDIR /app

EXPOSE 3000

CMD ["yarn","server"]
