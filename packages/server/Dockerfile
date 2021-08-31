FROM node:16-buster

WORKDIR /app
COPY . .

# Fix env variables overlapping, if .env already exists
RUN rm -frv packages/server/.env
RUN rm -frv packages/webapp/.env

RUN yarn
RUN yarn migrane

WORKDIR /app

EXPOSE 3000

CMD ["yarn","server"]
