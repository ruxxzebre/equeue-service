FROM node:16-buster

WORKDIR /app
COPY . .

RUN yarn
RUN yarn migrane

WORKDIR /app

EXPOSE 3000

CMD ["yarn","server"]
